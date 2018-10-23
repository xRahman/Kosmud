/*
  Part of Kosmud

  Div element containing html canvas.
*/

import { Component } from "../../Client/Gui/Component";
import { Renderer } from "../../Client/Phaser/Renderer";

export class CanvasDiv extends Component
{
  // ! Throws an exception on error.
  constructor(parent: HTMLElement)
  {
    super();

    // ! Throws an exception on error.
    this.element = Component.createDiv(parent);

    /// TODO: Předělat na parametr funkce createDiv():
    this.setCss(CanvasDiv.css);

    /// TODO: Předělat na parametr funkce createDiv():
    this.element.id = CanvasDiv.ELEMENT_ID;

    window.addEventListener
    (
      "resize",
      () => { this.onResize(); }
    );
  }

  protected static css: Partial<CSSStyleDeclaration> =
  {
    outline: "0 none",
    margin: "0px",
    padding: "0px",
    width: "100%",
    height: "100%",
    minHeight: "100%",
    minWidth: "100%",
    position: "absolute",

    // Disable text selection.
    webkitUserSelect: "none",
    userSelect: "none",

    // Set default cursor.
    // (otherwise text select cursor would appear on
    //  components with disabled text selection)
    cursor: "default"
  };

  // --------------- Static accessors -------------------

  // ---------------- Protected data --------------------

  protected element: HTMLElement;

  // ----------------- Private data ---------------------

  // ---------------- Public methods --------------------

  public getWidth()
  {
    return this.element.clientWidth;
  }

  public getHeight()
  {
    return this.element.clientHeight;
  }

  // ---------------- Event handlers --------------------

  private onResize()
  {
    Renderer.resize(this.getWidth(), this.getHeight());
  }

  // ---------------- Private methods -------------------
}

// ------------------ Type Declarations ----------------------

export namespace CanvasDiv
{
  export const ELEMENT_ID = "canvas_div";
}

// ----------------- Auxiliary Functions ---------------------
