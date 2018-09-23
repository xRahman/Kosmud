"use strict";
/*
  Part of BrutusNEXT

  Implements http server.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ERROR_1 = require("../../Shared/ERROR");
const Syslog_1 = require("../../Shared/Syslog");
const FileSystem_1 = require("../../Server/FS/FileSystem");
const MessageType_1 = require("../../Shared/MessageType");
const WebSocketServer_1 = require("../../Server/Net/WebSocketServer");
// Built-in node.js modules.
const http = require("http"); // Import namespace 'http' from node.js.
const url = require("url"); // Import namespace 'url' from node.js.
// 'nodePath' to prevent conflicts with variable 'path'.
const nodePath = require("path"); // Import namespace 'path' from node.js.
const MIME_TYPE = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};
class HttpServer {
    constructor() {
        // ----------------- Public data ----------------------
        // Do we accept http requests?
        this.open = false;
        // ----------------- Private data ---------------------
        this.port = HttpServer.DEFAULT_PORT;
        this.httpServer = null;
        // Websocket server runs inside a http server.
        this.webSocketServer = new WebSocketServer_1.WebSocketServer();
    }
    static get WWW_ROOT() { return './Client'; }
    static get DEFAULT_PORT() { return 80; }
    // --------------- Public accessors -------------------
    getPort() { return this.port; }
    getServer() { return this.httpServer; }
    isOpen() { return this.open; }
    // ---------------- Public methods --------------------
    // Starts the http server.
    start({ port } = { port: HttpServer.DEFAULT_PORT }) {
        this.port = port;
        this.httpServer = http.createServer((request, response) => { this.onRequest(request, response); });
        this.httpServer.on('error', (error) => { this.onError(error); });
        Syslog_1.Syslog.log("Starting http server at port " + port, MessageType_1.MessageType.SYSTEM_INFO);
        this.httpServer.listen(port, () => { this.onStartListening(); });
    }
    // ---------------- Event handlers --------------------
    // Runs when server is ready and listening.
    onStartListening() {
        if (this.httpServer === null) {
            ERROR_1.ERROR("Invalid 'httpServer'");
            return;
        }
        Syslog_1.Syslog.log("Http server is up and listening", MessageType_1.MessageType.HTTP_SERVER);
        this.open = true;
        // Start a websocket server inside the http server.
        this.webSocketServer.start(this.httpServer);
    }
    // Handles http requests.
    onRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.url) {
                ERROR_1.ERROR("Missing 'url' on http request");
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
            let data = yield FileSystem_1.FileSystem.readFile(path, {
                binary: true,
                // Do not report http request errors to the server log, it
                // would cause spam if someone played with typing random urls.
                reportErrors: false
            });
            if (data === null) {
                response.statusCode = 404;
                response.end('File ' + path + ' not found!');
                return;
            }
            // Based on the URL path, extract the file extention.
            const ext = nodePath.parse(path).ext;
            // Set mime type to the response header.
            response.setHeader('Content-type', MIME_TYPE[ext] || 'text/plain');
            // Send 'data' as response.
            response.end(data, FileSystem_1.FileSystem.BINARY_FILE_ENCODING);
        });
    }
    onError(error) {
        Syslog_1.Syslog.log("Error: " + error.message, MessageType_1.MessageType.HTTP_SERVER);
    }
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=HttpServer.js.map