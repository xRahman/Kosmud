/*
  Part of Kosmud

  Wraps html <body> element.
*/

import { Component } from "../../Client/Gui/Component";
import { Gui } from "../../Client/Gui/Gui";
import { CanvasDiv } from "../../Client/Gui/CanvasDiv";

export class Body extends Component
{
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

  protected element: HTMLElement;

  /// TEMPORARY (CanvasDiv should be a window).
  private readonly canvasDiv: CanvasDiv;

  // ! Throws an exception on error.
  constructor(bodyElement: HTMLElement)
  {
    super();

    this.element = bodyElement;
    this.setCss(Body.css);

    this.canvasDiv = new CanvasDiv(this.element);
  }

  // --------------- Static accessors -------------------

  /// TEMPORARY (CanvasDiv should be a window).
  public static getCanvasDiv()
  {
    return Gui.getBody().canvasDiv;
  }

  /// TEMPORARY (CanvasDiv should be a window).
  public static getCanvasDivElement()
  {
    return Gui.getBody().getElement();
  }
}