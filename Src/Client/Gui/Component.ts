/*
  Part of Kosmud

  Abstract ancestor of classes that encapsulate DOM elements.
*/

import { ERROR } from "../../Shared/Error/ERROR";

export abstract class Component
{
  // -------------- Static class data -------------------

  // ----------------- Private data --------------------- 

  // ---------------- Protected data -------------------- 

  protected element: HTMLElement | null = null;

  // ----------------- Public data ---------------------- 

  // --------------- Public accessors -------------------

  // ---------------- Public methods --------------------

  // --------------- Protected methods ------------------

  protected setCss(css: Partial<CSSStyleDeclaration>)
  {
    if (!this.element)
    {
      ERROR("Attempt to set css to component that doesn't have"
        + " a DOM element yet.");
      return;
    }

    // Here we iterate over all own properties of 'css' object and
    // set their values to respective properties in this.element.style.
    // (It works because 'css' has the same properties as
    //  this.element.style, only they are all optional).
    for (let property in css)
    {
      if (css.hasOwnProperty(property))
      {
        let value = css[property];

        if (value)
          this.element.style[property] = value;
      }
    }
  }

  // ---------------- Private methods -------------------

}

// ------------------ Type Declarations ----------------------

// export module Component
// {
// }