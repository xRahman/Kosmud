/*
  Part of Kosmud

  Wraps <html> element and html 'document'.
*/

import { Component } from "../../Client/Gui/Component";

export class Html extends Component
{
  protected static css: Partial<CSSStyleDeclaration> =
  {
    height: "100%",
    outline: "0 none",
    margin: "0px",
    padding: "0px"
  };

  protected element: HTMLElement;

  // ! Throws an exception on error.
  constructor(htmlElement: HTMLElement)
  {
    super();

    this.element = htmlElement;
    this.setCss(Html.css);

    window.addEventListener("resize", () => { onDocumentResize(); });
  }
}

// ---------------- Event handlers --------------------

function onDocumentResize()
{
  // Windows.onDocumentResize();
}