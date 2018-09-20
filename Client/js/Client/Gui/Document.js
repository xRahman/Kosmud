/*
  Part of Kosmud

  Functionality attached to html document.
*/
define(["require", "exports", "../../Client/Gui/Html", "../../Client/Gui/Body"], function (require, exports, Html_1, Body_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {Windows} from '../../Client/Gui/Windows';
    // This does nothing, it's here only to mark these modules as 'used'.
    // (We need to import them from somewhere to inicialize them).
    Html_1.Html;
    Body_1.Body;
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