/*
  Part of Kosmud

  Functionality attached to html document.
*/
define(["require", "exports", "../../Client/Gui/Html", "../../Client/Gui/Body"], function (require, exports, Html_1, Body_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {Windows} from '../../Client/Gui/Windows';
    class Document {
        constructor() {
            // ----------------- Private data ---------------------
            // <body> element.
            this.body = new Body_1.Body();
            // <html> element.
            this.html = new Html_1.Html();
            window.addEventListener('resize', () => { this.onDocumentResize(); });
        }
        // --------------- Static accessors -------------------
        // ---------------- Event handlers --------------------
        onDocumentResize() {
            // Windows.onDocumentResize();
        }
    }
    exports.Document = Document;
});
//# sourceMappingURL=Document.js.map