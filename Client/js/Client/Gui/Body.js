/*
  Part of Kosmud

  <body> element.
*/
define(["require", "exports", "../../Client/Gui/Component", "../../Client/Gui/CanvasDiv"], function (require, exports, Component_1, CanvasDiv_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    const BODY_ELEMENT_ID = 'body';
    class Body extends Component_1.Component {
        // ! Throws an exception on error.
        constructor() {
            super();
            // ! Throws an exception on error.
            this.element = getBodyElement();
            this.setCss(Body.css);
            this.canvasDiv = new CanvasDiv_1.CanvasDiv(this.element);
        }
        // --------------- Static accessors -------------------
        static getCanvasDivElement() {
            return Body.instance.canvasDiv.getElement();
        }
    }
    Body.css = {
        outline: '0 none',
        margin: '0px',
        padding: '0px',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        minWidth: '100%',
        position: 'absolute',
        // Disable text selection.
        webkitUserSelect: 'none',
        userSelect: 'none',
        // Set default cursor.
        // (otherwise text select cursor would appear on
        //  components with disabled text selection)
        cursor: 'default'
    };
    Body.instance = new Body();
    exports.Body = Body;
    // ----------------- Auxiliary Functions ---------------------
    // ! Throws an exception on error.
    function getBodyElement() {
        let body = document.getElementById(BODY_ELEMENT_ID);
        if (!body) {
            throw new Error("Unable to find <body> element by id '" + BODY_ELEMENT_ID + "'");
        }
        return body;
    }
});
//# sourceMappingURL=Body.js.map