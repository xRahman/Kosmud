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
define(["require", "exports", "../../Shared/ERROR", "../../Shared/Syslog", "../../Server/FS/FileSystem", "../../Shared/MessageType", "../../Server/Net/WebSocketServer", "https", "url", "path"], function (require, exports, ERROR_1, Syslog_1, FileSystem_1, MessageType_1, WebSocketServer_1, https, url, nodePath) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const PRIVATE_KEY_FILE = './Server/Keys/kosmud-key.pem';
    const CERTIFICATE_FILE = './Server/Keys/kosmud-cert.pem';
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
            this.port = HttpServer.DEFAULT_HTTP_PORT;
            //private httpServer: (http.Server | null) = null;
            this.httpsServer = null;
            // Websocket server runs inside a http server.
            this.webSocketServer = new WebSocketServer_1.WebSocketServer();
        }
        static get WWW_ROOT() { return './Client'; }
        static get DEFAULT_HTTP_PORT() { return 80; }
        static get DEFAULT_HTTPS_PORT() { return 443; }
        // --------------- Public accessors -------------------
        getPort() { return this.port; }
        getServer() { return this.httpsServer; }
        isOpen() { return this.open; }
        // ---------------- Public methods --------------------
        // Starts the https server.
        start({ port } = { port: HttpServer.DEFAULT_HTTPS_PORT }) {
            return __awaiter(this, void 0, void 0, function* () {
                this.port = port;
                let certificate = yield loadCertificate();
                this.httpsServer = https.createServer(certificate, (request, response) => { this.onRequest(request, response); });
                this.httpsServer.on('error', (error) => { this.onError(error); });
                Syslog_1.Syslog.log("Starting http server at port " + port, MessageType_1.MessageType.SYSTEM_INFO);
                this.httpsServer.listen(port, () => { this.onStartListening(); });
            });
        }
        // ---------------- Event handlers --------------------
        // Runs when server is ready and listening.
        onStartListening() {
            if (this.httpsServer === null) {
                ERROR_1.ERROR("Invalid 'httpsServer'");
                return;
            }
            Syslog_1.Syslog.log("Https server is up and listening", MessageType_1.MessageType.HTTP_SERVER);
            this.open = true;
            // Start a websocket server inside the http server.
            this.webSocketServer.start(this.httpsServer);
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
    // ----------------- Auxiliary Functions ---------------------
    // ! Throws exception on error.
    function loadCertificate() {
        return __awaiter(this, void 0, void 0, function* () {
            let key = yield FileSystem_1.FileSystem.readFile(PRIVATE_KEY_FILE);
            let cert = yield FileSystem_1.FileSystem.readFile(CERTIFICATE_FILE);
            if (!key || !cert)
                throw new Error("Failed to load https key or certificate");
            return { key: key, cert: cert };
        });
    }
});
//# sourceMappingURL=HttpServer.js.map