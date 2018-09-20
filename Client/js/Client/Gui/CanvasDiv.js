/*
  Part of Kosmud

  Div element containing html canvas.
*/
define(["require", "exports", "../../Client/Gui/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasDiv extends Component_1.Component {
        // ! Throws an exception on error.
        constructor(parent) {
            super();
            // ! Throws an exception on error.
            this.element = this.createDiv(parent);
            this.setCss(CanvasDiv.css);
            /// TODO: Předělat na parametr funkce createDiv():
            this.element.id = CanvasDiv.ELEMENT_ID;
        }
    }
    CanvasDiv.css = {
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
    exports.CanvasDiv = CanvasDiv;
    // ------------------ Type Declarations ----------------------
    (function (CanvasDiv) {
        CanvasDiv.ELEMENT_ID = 'canvas_div';
    })(CanvasDiv = exports.CanvasDiv || (exports.CanvasDiv = {}));
});
// ----------------- Auxiliary Functions ---------------------
//# sourceMappingURL=CanvasDiv.js.map