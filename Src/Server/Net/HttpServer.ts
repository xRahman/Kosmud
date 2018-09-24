/*
  Part of BrutusNEXT

  Implements http server.
*/

import {ERROR} from '../../Shared/ERROR';
import {Syslog} from '../../Shared/Syslog';
import {FileSystem} from '../../Server/FS/FileSystem';
import {MessageType} from '../../Shared/MessageType';
import {WebSocketServer} from '../../Server/Net/WebSocketServer';

// Built-in node.js modules.
import * as http from 'http';  // Import namespace 'http' from node.js.
import * as https from 'https';  // Import namespace 'https' from node.js.
import * as url from 'url';  // Import namespace 'url' from node.js.
// 'nodePath' to prevent conflicts with variable 'path'.
import * as nodePath from 'path';  // Import namespace 'path' from node.js.

const PRIVATE_KEY_FILE = './Server/Keys/kosmud-key.pem';
const CERTIFICATE_FILE = './Server/Keys/kosmud-cert.pem';

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

export class HttpServer
{
  constructor() { }

  public static get WWW_ROOT() { return './Client'; }

  // ----------------- Public data ----------------------

  // Do we accept http requests?
  private open = false;

  public static get DEFAULT_HTTP_PORT() { return 80; }
  public static get DEFAULT_HTTPS_PORT() { return 443; }

  // --------------- Public accessors -------------------

  public getPort() { return this.port; }

  public getServer() { return this.httpsServer; }

  public isOpen() { return this.open; }

  // ---------------- Public methods --------------------

  // Starts the https server.
  public async start({ port } = { port: HttpServer.DEFAULT_HTTPS_PORT })
  {
    this.port = port;
    
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
    )

    Syslog.log
    (
      "Starting http server at port " + port,
      MessageType.SYSTEM_INFO
    );

    this.httpsServer.listen
    (
      port,
      () => { this.onStartListening(); }
    );
  }

  // ----------------- Private data ---------------------

  private port = HttpServer.DEFAULT_HTTP_PORT;

  //private httpServer: (http.Server | null) = null;
  private httpsServer: (https.Server | null) = null;

  // Websocket server runs inside a http server.
  private webSocketServer = new WebSocketServer();
  
  // ---------------- Event handlers --------------------

  // Runs when server is ready and listening.
  private onStartListening()
  {
    if (this.httpsServer === null)
    {
      ERROR("Invalid 'httpsServer'");
      return;
    }

    Syslog.log
    (
      "Https server is up and listening",
      MessageType.HTTP_SERVER
    );

    this.open = true;

    // Start a websocket server inside the http server.
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

    // Parse URL.
    const parsedUrl = url.parse(request.url);
    // Extract URL path.
    let path = HttpServer.WWW_ROOT + parsedUrl.pathname;

    // If root directory is accessed, serve 'index.html'.
    if (request.url === "/")
      path += 'index.html';

    // console.log('- Incomming http request: ' + path);

    // Attempt to read the file.
    let data = await FileSystem.readFile
    (
      path,
      {
        binary: true,
        // Do not report http request errors to the server log, it
        // would cause spam if someone played with typing random urls.
        reportErrors: false
      }
    );

    if (data === null)
    {
      response.statusCode = 404;
      response.end('File ' + path + ' not found!');
      return;
    }

    // Based on the URL path, extract the file extention.
    const ext = nodePath.parse(path).ext;

    // Set mime type to the response header.
    response.setHeader('Content-type', MIME_TYPE[ext] || 'text/plain');
    // Send 'data' as response.
    response.end(data, FileSystem.BINARY_FILE_ENCODING);
  }

  private onError(error: Error)
  {
    Syslog.log
    (
      "Error: " + error.message,
      MessageType.HTTP_SERVER
    );
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
async function loadCertificate()
{
  let key = await FileSystem.readFile(PRIVATE_KEY_FILE);
  let cert = await  FileSystem.readFile(CERTIFICATE_FILE);

  if (!key || !cert)
    throw new Error("Failed to load https key or certificate");

  return { key: key, cert: cert };
}