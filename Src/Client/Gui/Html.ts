/*
  Part of Kosmud

  <html> element and functionality attached to html 'document'.
*/

import {Component} from '../../Client/Gui/Component';

export class Html extends Component
{
  // ! Throws an exception on error.
  constructor(htmlElement: HTMLElement)
  {
    super();

    this.element = htmlElement;

    this.setCss(Html.css);
  }

  // -------------- Private static data -----------------

  private static htmlElement: Html | "Doesn't exist" = "Doesn't exist";

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static init()
  {
    if (this.htmlElement !== "Doesn't exist")
    {
      throw new Error("Failed to init html element because it already exists");
    }

    // 'document.documentElement' is a direct reference to <html> element.
    if (!document.documentElement)
    {
      throw new Error("Failed to init html element because"
        + " it doesn't exist in the DOM");
    }

    this.htmlElement = new Html(document.documentElement);

    window.addEventListener('resize', () => { this.onDocumentResize(); });
  }

  protected static css: Partial<CSSStyleDeclaration> =
  {
    height: "100%",
    outline: "0 none",
    margin: "0px",
    padding: "0px"
  }

  // ---------------- Protected data -------------------- 

  protected element: HTMLElement;

  // ---------------- Event handlers --------------------

  private static onDocumentResize()
  {
    // Windows.onDocumentResize();
  }
}