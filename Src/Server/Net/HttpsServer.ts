/*
  Part of Kosmud

  Https server.
*/

import { REPORT } from '../../Shared/Log/REPORT';
import { ERROR } from '../../Shared/Log/ERROR';
import { Syslog } from '../../Shared/Log/Syslog';
import { FileSystem } from '../FS/FileSystem';
import { MessageType } from '../../Shared/MessageType';
import { WebSocketServer } from './WebSocketServer';

// Built-in node.js modules.
import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
// 'nodePath' to prevent conflicts with variable 'path'.
import * as nodePath from 'path';

// 3rd party modules.
import * as express from 'express';
import { Express } from 'express';

const PRIVATE_KEY_FILE = './Server/Keys/kosmud-key.pem';
const CERTIFICATE_FILE = './Server/Keys/kosmud-cert.pem';

const WWW_ROOT = './Client';

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_HTTPS_PORT = 443;

const MIME_TYPE: { [key: string]: string } =
{
  '.ico' : 'image/x-icon',
  '.html': 'text/html',
  '.js'  : 'text/javascript',
  '.json': 'application/json',
  '.css' : 'text/css',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.wav' : 'audio/wav',
  '.mp3' : 'audio/mpeg',
  '.svg' : 'image/svg+xml',
  '.pdf' : 'application/pdf',
  '.doc' : 'application/msword',
  '.eot' : 'appliaction/vnd.ms-fontobject',
  '.ttf' : 'aplication/font-sfnt'
};

export class HttpsServer
{
  // ----------------- Public data ----------------------

  // --------------- Public accessors -------------------

  public getHttpPort() { return this.httpPort; }
  public getHttpsPort() { return this.httpsPort; }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public async start
  (
    { httpPort = DEFAULT_HTTP_PORT, httpsPort = DEFAULT_HTTPS_PORT } = {}
  )
  {
    this.startHttpServer(httpPort, this.expressApp);
    this.startHttpsServer(httpsPort, this.expressApp);

    redirectHttpToHttps(this.expressApp);
    serveStaticFiles(this.expressApp);
  }

  private async startHttpServer(port: number, expressApp: Express)
  {
    if (this.httpServer !== "Not running")
    {
      throw new Error("Failed to start http server because it's"
        + " already running");
    }

    this.httpPort = port;

    Syslog.log
    (
      "Starting http server at port " + port, MessageType.SYSTEM_INFO
    );

    this.httpServer = http.createServer(expressApp).listen(port);
  }

  private async startHttpsServer(port: number, expressApp: Express)
  {
    if (this.httpsServer !== "Not running")
    {
      throw new Error("Failed to start https server because it's"
        + " already running");
    }

    Syslog.log
    (
      "Starting https server at port " + port, MessageType.SYSTEM_INFO
    );

    this.httpsPort = port;
    
    // ! Throws exception on error.
    let certificate = await loadCertificate();


    this.httpsServer = https.createServer(certificate, expressApp);

    this.httpsServer.on
    (
      'error',
      (error) => { this.onError(error); }
    );

    this.httpsServer.listen
    (
      port,
      () => { this.onStartListening(); }
    );
  }

  // ----------------- Private data ---------------------

  private httpPort = DEFAULT_HTTP_PORT;
  private httpsPort = DEFAULT_HTTPS_PORT;

  // Use 'express' to handle security issues like directory traversing.
  private expressApp = express();

  private httpServer: (http.Server | "Not running") = "Not running";
  private httpsServer: (https.Server | "Not running") = "Not running";

  // Websocket server runs inside a https server.
  private webSocketServer = new WebSocketServer();
  
  // ---------------- Event handlers --------------------

  // Runs when server is ready and listening.
  private onStartListening()
  {
    if (this.httpsServer === "Not running")
    {
      ERROR("HttpsServer isn't running even though it"
        + " has just started listening - Huh?!?");
      return;
    }

    Syslog.log
    (
      "Https server is up and listening",
      MessageType.HTTPS_SERVER
    );

    // Start a websocket server inside the https server.
    this.webSocketServer.start(this.httpsServer);
  }

  private onError(error: Error)
  {
    Syslog.log("Error: " + error.message, MessageType.HTTPS_SERVER);
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
    return await readFile(PRIVATE_KEY_FILE);
  }
  catch(error)
  {
    error.message = "Failed to read ssl private key: " + error.message;
    throw error;
  }
}

// ! Throws exception on error.
async function readCertificate(): Promise<string>
{
  try
  {
    return await readFile(CERTIFICATE_FILE);
  }
  catch(error)
  {
    error.message = "Failed to read ssl certificate: " + error.message;
    throw error;
  }
}

// ! Throws exception on error.
async function readFile(path: string): Promise<string>
{
  // ! Throws exception on error.
  let readResult = await FileSystem.readFile(path, true);

  if (readResult === "File doesn't exist")
  {
    throw new Error("File " + path + " doesn't exist");
  }

  return readResult.data;
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
        response.redirect('https://' + request.headers.host + request.url);
      }
    }
  );
}

function serveStaticFiles(expressApp: Express)
{
  expressApp.use(express.static(WWW_ROOT));
}