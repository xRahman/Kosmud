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
        }
        // --------------- Static accessors -------------------
        // public static get $body() { return ClientApp.document.$body; }
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