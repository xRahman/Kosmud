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

    window.addEventListener('resize', () => { this.onDocumentResize(); });
  }

  // ------------- Protected static data ----------------

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

  private onDocumentResize()
  {
    // Windows.onDocumentResize();
  }
}