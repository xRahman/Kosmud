/*
  Part of Kosmud

  Functionality attached to html document.
*/
define(["require", "exports", "../../Client/Gui/Html", "../../Client/Gui/Body"], function (require, exports, Html_1, Body_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {Windows} from '../../Client/Gui/Windows';
    Html_1.Html; // Inits the class.
    Body_1.Body; // Inits the class.
    class Document {
        constructor() {
            window.addEventListener('resize', () => { this.onDocumentResize(); });
        }
        // ----------------- Private data ---------------------
        // --------------- Static accessors -------------------
        // ---------------- Event handlers --------------------
        onDocumentResize() {
            // Windows.onDocumentResize();
        }
    }
    exports.Document = Document;
});
//# sourceMappingURL=Document.js.map