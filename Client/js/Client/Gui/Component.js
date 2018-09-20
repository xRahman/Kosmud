/*
  Part of Kosmud

  Abstract ancestor of classes that encapsulate DOM elements.
*/
define(["require", "exports", "../../Shared/ERROR"], function (require, exports, ERROR_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Component {
        // ----------------- Public data ---------------------- 
        // --------------- Public accessors -------------------
        getElement() { return this.element; }
        // ---------------- Public methods --------------------
        // --------------- Protected methods ------------------
        setCss(css) {
            if (!this.element) {
                ERROR_1.ERROR("Attempt to set css to component that doesn't have"
                    + " a DOM element yet.");
                return;
            }
            // Here we iterate over all own properties of 'css' object and
            // set their values to respective properties in this.element.style.
            // (It works because 'css' has the same properties as
            //  this.element.style, only they are all optional).
            for (let property in css) {
                if (css.hasOwnProperty(property)) {
                    let value = css[property];
                    if (value)
                        this.element.style[property] = value;
                }
            }
        }
        createDiv(parent, insertMode = Component.InsertMode.APPEND) {
            let div = document.createElement('div');
            insertToParent(div, parent, insertMode);
            /// TODO: Nastavit atributy, css.
            return div;
        }
    }
    exports.Component = Component;
    // ------------------ Type Declarations ----------------------
    (function (Component) {
        let InsertMode;
        (function (InsertMode) {
            // Insert as the last child (default).
            InsertMode[InsertMode["APPEND"] = 0] = "APPEND";
            // Insert as the first child.
            InsertMode[InsertMode["PREPEND"] = 1] = "PREPEND";
            // Html contents of $parent is cleared first.
            InsertMode[InsertMode["REPLACE"] = 2] = "REPLACE";
        })(InsertMode = Component.InsertMode || (Component.InsertMode = {}));
    })(Component = exports.Component || (exports.Component = {}));
    // ----------------- Auxiliary Functions ---------------------
    function clearHtmlContent(element) {
        while (element.lastChild)
            element.removeChild(element.lastChild);
    }
    function insertToParent(element, parent, mode) {
        switch (mode) {
            case Component.InsertMode.APPEND:
                parent.appendChild(element);
                break;
            case Component.InsertMode.PREPEND:
                parent.insertBefore(element, parent.firstChild);
                break;
            case Component.InsertMode.REPLACE:
                clearHtmlContent(parent);
                parent.appendChild(element);
                break;
            default:
                ERROR_1.ERROR("Unknown insert mode. Element is not inserted to parent");
                break;
        }
    }
});
//# sourceMappingURL=Component.js.map