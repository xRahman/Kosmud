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

const PRIVATE_KEY_FILE = './Server/Keys/kosmud-key.pem';
const CERTIFICATE_FILE = './Server/Keys/kosmud-cert.pem';

const WWW_ROOT = './Client';

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

  // Do we accept http requests?
  private open = false;

  // --------------- Public accessors -------------------

  public getPort() { return this.port; }
  public isOpen() { return this.open; }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public async start(port = DEFAULT_HTTPS_PORT)
  {
    if (this.httpsServer !== "Doesn't exist")
    {
      throw new Error("Failed to start https server because it's"
        + " already running");
    }

    Syslog.log
    (
      "Starting https server at port " + port, MessageType.SYSTEM_INFO
    );

    this.port = port;
    
    // ! Throws exception on error.
    let certificate = await loadCertificate();

    this.httpsServer = https.createServer
    (
      certificate,
      (request, response) => { this.onRequest(request, response); }
    );

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

  private port = DEFAULT_HTTPS_PORT;

  private httpsServer: (https.Server | "Doesn't exist") = "Doesn't exist";

  // Websocket server runs inside a https server.
  private webSocketServer = new WebSocketServer();
  
  // ---------------- Event handlers --------------------

  // Runs when server is ready and listening.
  private onStartListening()
  {
    if (this.httpsServer === "Doesn't exist")
    {
      ERROR("HttpsServer doesn't exist even though it"
        + " has just started listening - Huh?!?");
      return;
    }

    Syslog.log
    (
      "Https server is up and listening",
      MessageType.HTTPS_SERVER
    );

    this.open = true;

    // Start a websocket server inside the https server.
    this.webSocketServer.start(this.httpsServer);
  }

  // Handles http requests.
  private async onRequest
  (
    request: http.IncomingMessage,
    response: http.ServerResponse
  )
  {
    if (!request.url)
    {
      ERROR("Missing 'url' on http request");
      return;
    }

    const parsedUrl = url.parse(request.url);
    let path = WWW_ROOT + parsedUrl.pathname;

    // If root directory is accessed, serve 'index.html'.
    if (request.url === "/")
      path += 'index.html';

    /// DEBUG:
    // console.log('- Incomming http request: ' + path);

    await serveFile(path, response);
  }

  private onError(error: Error)
  {
    Syslog.log("Error: " + error.message, MessageType.HTTPS_SERVER);
  }
}

// ----------------- Auxiliary Functions ---------------------

function send404(response: http.ServerResponse)
{
  response.statusCode = 404;
  response.end('File not found!');
}

function send500(response: http.ServerResponse)
{
  response.statusCode = 500;
  response.end('Internal server error.');
}

function sendData(response: http.ServerResponse, data: string, path: string)
{
  // Based on the URL path, extract the file extention.
  const ext = nodePath.parse(path).ext;

  // Set mime type to the response header.
  response.setHeader('Content-type', MIME_TYPE[ext] || 'text/plain');
  // Send 'data' as response.
  response.end(data, FileSystem.BINARY);
}

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

async function serveFile(path: string, response: http.ServerResponse)
{
  let readResult: { data: string } | "File doesn't exist";

  try
  {
    readResult = await FileSystem.readFile(path, true);
  }
  catch(error)
  {
    REPORT(error);
    send500(response);
    return;
  }

  if (readResult === "File doesn't exist")
  {
    send404(response);
    return;
  }

  sendData(response, readResult.data, path);
}