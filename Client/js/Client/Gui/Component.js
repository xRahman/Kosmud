/*
  Part of Kosmud

  Abstract ancestor of classes that encapsulate DOM elements.
*/
define(["require", "exports", "../../Shared/Error/ERROR"], function (require, exports, ERROR_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Component {
        constructor() {
            // -------------- Static class data -------------------
            // ----------------- Private data --------------------- 
            // ---------------- Protected data -------------------- 
            this.element = null;
            // ---------------- Private methods -------------------
        }
        // ----------------- Public data ---------------------- 
        // --------------- Public accessors -------------------
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
    }
    exports.Component = Component;
});
// ------------------ Type Declarations ----------------------
// export module Component
// {
// }
//# sourceMappingURL=Component.js.map