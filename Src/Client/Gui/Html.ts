/*
  Part of Kosmud

  <html> element.
*/

import {Component} from '../../Client/Gui/Component';

export class Html extends Component
{
  // ! Throws an exception on error.
  constructor()
  {
    super();

    // 'document.documentElement' is a direct reference to an <html> element.
    this.element = document.documentElement;

    this.setCss(Html.css);
  }

  protected static css: Partial<CSSStyleDeclaration> =
  {
    height: "100%",
    outline: "0 none",
    margin: "0px",
    padding: "0px"
  }

  private static instance = new Html();

  // --------------- Static accessors -------------------

  // ---------------- Protected data -------------------- 

  protected element: HTMLElement;

  // ----------------- Private data ---------------------

  // ---------------- Event handlers --------------------

  // ---------------- Private methods -------------------
}