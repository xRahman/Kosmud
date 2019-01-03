/*
  Part of Kosmud

  Https server.
*/

import { REPORT } from "../../Shared/Log/REPORT";
import { ERROR } from "../../Shared/Log/ERROR";
import { Syslog } from "../../Shared/Log/Syslog";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { WebSocketServer } from "../../Server/Net/WebSocketServer";

// Built-in node.js modules.
import * as http from "http";
import * as https from "https";

// 3rd party modules.
import * as express from "express";
// This extra import is a anecessary workaround
// (without it, you get an error "Cannot use namespace 'Express' as a type").
// tslint:disable-next-line:no-duplicate-imports
import { Express } from "express";

const PRIVATE_KEY_FILE = "./Keys/kosmud-key.pem";
const CERTIFICATE_FILE = "./Keys/kosmud-cert.pem";

const WWW_ROOT = "./Client";

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_HTTPS_PORT = 443;

// tslint:disable-next-line:no-unnecessary-class
export class HttpsServer
{
  // ----------------- Private data ---------------------

  // Use 'express' to handle security issues like directory traversing.
  private static readonly expressApp = express();

  private static httpServer: (http.Server | "Not running") = "Not running";
  private static httpsServer: (https.Server | "Not running") = "Not running";

  // Websocket server runs inside a https server.
  private static readonly webSocketServer = new WebSocketServer();

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public static async startServers
  (
    { httpPort = DEFAULT_HTTP_PORT, httpsPort = DEFAULT_HTTPS_PORT } = {}
  )
  {
    // ! Throws exception on error.
    await this.startHttpServer(httpPort, this.expressApp);

    redirectHttpToHttps(this.expressApp);

    // ! Throws exception on error.
    await this.startHttpsServer(httpsPort, this.expressApp);

    serveStaticFiles(this.expressApp);
  }

  // ! Throws exception on error.
  private static async startHttpServer(port: number, expressApp: Express)
  {
    if (this.httpServer !== "Not running")
    {
      throw Error(`Failed to start http server because it's`
        + ` already running`);
    }

    Syslog.log("[INFO]", `Starting http server at port ${port}`);

    this.httpServer = http.createServer(expressApp);

    this.httpServer.on
    (
      "error",
      (error) => { this.onHttpError(error); }
    );

    this.httpServer.listen
    (
      port,
      () => { this.onHttpStartListening(); }
    );
  }

  // ! Throws exception on error.
  private static async startHttpsServer(port: number, expressApp: Express)
  {
    if (this.httpsServer !== "Not running")
    {
      throw Error("Failed to start https server because it's"
        + " already running");
    }

    Syslog.log("[INFO]", `Starting https server at port ${port}`);

    // ! Throws exception on error.
    const certificate = await loadCertificate();

    this.httpsServer = https.createServer(certificate, expressApp);

    this.httpsServer.on
    (
      "error",
      (error) => { this.onHttpsError(error); }
    );

    this.httpsServer.listen
    (
      port,
      () => { this.onHttpsStartListening(); }
    );
  }

  // ---------------- Event handlers --------------------

  private static onHttpStartListening()
  {
    if (this.httpServer === "Not running")
    {
      ERROR("HttpServer isn't running even though it"
        + " has just started listening - Huh?!?");
      return;
    }

    Syslog.log("[HTTP_SERVER]", "Http server is up and listening");
  }

  // Executes when https server is ready and listening.
  private static onHttpsStartListening()
  {
    if (this.httpsServer === "Not running")
    {
      ERROR("HttpsServer isn't running even though it"
        + " has just started listening - Huh?!?");
      return;
    }

    Syslog.log("[HTTPS_SERVER]", "Https server is up and listening");

    try
    {
      this.webSocketServer.startInsideHttpsServer(this.httpsServer);
    }
    catch (error)
    {
      REPORT(error);
    }
  }

  private static onHttpError(error: Error)
  {
    Syslog.log("[HTTP_SERVER]", `Http error: {$error.message}`);
  }

  private static onHttpsError(error: any)
  {
    if (!(error instanceof Error))
      throw Error("Invalid error object");

    Syslog.log("[HTTPS_SERVER]", `Https error: ${error.message}`);
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
async function loadCertificate()
{
  return { key: await readPrivateKey(), cert: await readCertificate() };
}

// ! Throws exception on error.
async function readPrivateKey(): Promise<string>
{
  try
  {
    return await FileSystem.readExistingFile(PRIVATE_KEY_FILE);
  }
  catch (error)
  {
    if (!(error instanceof Error))
      throw Error("Invalid error object");

    error.message = `Failed to read ssl private key: ${error.message}`;

    throw error;
  }
}

// ! Throws exception on error.
async function readCertificate(): Promise<string>
{
  try
  {
    return await FileSystem.readExistingFile(CERTIFICATE_FILE);
  }
  catch (error)
  {
    if (!(error instanceof Error))
      throw Error("Invalid error object");

    error.message = `Failed to read ssl certificate: ${error.message}`;

    throw error;
  }
}

function redirectHttpToHttps(expressApp: Express)
{
  expressApp.use
  (
    (request, response, next) =>
    {
      if (request.secure)
      {
        next();
      }
      else
      {
        response.redirect(`https://${request.headers.host}${request.url}`);
      }
    }
  );
}

function serveStaticFiles(expressApp: Express)
{
  expressApp.use(express.static(WWW_ROOT));
}