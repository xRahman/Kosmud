/*
  Part of Kosmud

  <html> element.
*/
define(["require", "exports", "../../Client/Gui/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Html extends Component_1.Component {
        // ! Throws an exception on error.
        constructor() {
            super();
            // 'document.documentElement' is a direct reference to an <html> element.
            this.element = document.documentElement;
            this.setCss(Html.css);
        }
    }
    Html.css = {
        height: "100%",
        outline: "0 none",
        margin: "0px",
        padding: "0px"
    };
    Html.instance = new Html();
    exports.Html = Html;
});
//# sourceMappingURL=Html.js.map