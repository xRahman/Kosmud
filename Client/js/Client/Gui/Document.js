/*
  Part of Kosmud

  Functionality attached to html document.
*/
define(["require", "exports", "../../Client/Gui/Body"], function (require, exports, Body_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {Windows} from '../../Client/Gui/Windows';
    class Document {
        constructor() {
            // ----------------- Private data ---------------------
            //private body: Body | null = null;
            this.body = new Body_1.Body();
            document.addEventListener('DOMContentLoaded', () => { this.onDocumentReady(); });
            // // Attach handler for 'window.resize' event.
            // $(window).resize
            // (
            //   'resize',
            //   // We call the handler 'onDocumentResize' instead of
            //   // 'onWindowResize' because we use windows inside our
            //   // application.
            //   () => { this.onDocumentResize(); }
            // );
            this.setRootHtmlElementCss();
        }
        // --------------- Static accessors -------------------
        // public static get $body() { return ClientApp.document.$body; }
        setRootHtmlElementCss() {
            console.log('Setting CSS to <html>');
            // Seting height of <html> element to 100% is necessary for the
            // <body> element and everything in it to stretch over whole
            // browser viewport (otherwise <body> would match it's height
            // to it's content).
            document.documentElement.style.height = "100%";
            // '!important' is used so that other style won't overrule this
            document.documentElement.style.outline = '0 none';
            document.documentElement.style.margin = '0px';
            document.documentElement.style.padding = "0px";
        }
        // ---------------- Event handlers --------------------
        // This handler is run when web page is completely loaded.
        onDocumentReady() {
            /// Nespouští se - údajně proto, že už je dávno firnutej, když
            /// se začne provádět můj kód. Asi bude lepší se prostě
            // na document.ready vykašlat.
            console.log('onDocumentReady()');
            // try
            // {
            //   this.body = new Body();
            // }
            // catch (error)
            // {
            //   REPORT(error, "Failed to init <body> element");
            // }
            // // Attach handler for 'keydown' event.
            // $(document).keydown
            // (
            //   (event: JQueryEventObject) => { this.onKeyDown(event); }
            // );
            // Windows.onDocumentReady();
        }
        onDocumentResize() {
            // Windows.onDocumentResize();
        }
    }
    exports.Document = Document;
});
//# sourceMappingURL=Document.js.map