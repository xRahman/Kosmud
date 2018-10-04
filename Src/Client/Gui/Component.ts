/*
  Part of Kosmud

  Abstract ancestor of classes that encapsulate DOM elements.
*/

import { ERROR } from "../../Shared/Log/ERROR";

export abstract class Component
{
  // -------------- Static class data -------------------

  // ----------------- Private data --------------------- 

  // ---------------- Protected data -------------------- 

  protected abstract element: HTMLElement;

  // ----------------- Public data ---------------------- 

  // --------------- Public accessors -------------------

  public getElement() { return this.element; }

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

  protected createDiv
  (
    parent: HTMLElement,
    insertMode: Component.InsertMode = Component.InsertMode.APPEND
  )
  : HTMLDivElement
  {
    let div = <HTMLDivElement>document.createElement('div');

    insertToParent(div, parent, insertMode);

    /// TODO: Nastavit atributy, css.

    return div;
  }

  // ---------------- Private methods -------------------
}

// ------------------ Type Declarations ----------------------

export module Component
{
  export enum InsertMode
  {
    // Insert as the last child (default).
    APPEND,
    // Insert as the first child.
    PREPEND,
    // Html contents of $parent is cleared first.
    REPLACE
  }
}

// ----------------- Auxiliary Functions ---------------------

function clearHtmlContent(element: HTMLElement)
{
  while (element.lastChild)
    element.removeChild(element.lastChild);
}

function insertToParent
(
  element: HTMLElement,
  parent: HTMLElement,
  mode: Component.InsertMode
)
{
  switch (mode)
  {
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
      ERROR("Unknown insert mode. Element is not inserted to parent");
      break;
  }
}