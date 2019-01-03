/*
  Part of Kosmud

  Abstract ancestor of classes wrapping DOM elements.
*/

import { ERROR } from "../../Shared/Log/ERROR";

export abstract class Component
{
  protected abstract element: HTMLElement;

  private displayMode = "block";

  // ------------ Protected static methods --------------

  /// This method is static because it doesn't access 'this'.
  protected static createDiv
  (
    parent: HTMLElement,
    insertMode: Component.InsertMode = Component.InsertMode.APPEND
  )
  : HTMLDivElement
  {
    const div = document.createElement("div");

    insertToParent(div, parent, insertMode);

    /// TODO: Nastavit atributy, css.

    return div;
  }

  // ---------------- Public methods --------------------

  public getElement() { return this.element; }

  public hide()
  {
    this.rememberDisplayMode();

    this.element.style.display = "none";
  }

  public show()
  {
    this.restoreDisplayMode();
  }

  // --------------- Protected methods ------------------

  protected setCss(css: Partial<CSSStyleDeclaration>)
  {
    // Here we iterate over all own properties of 'css' object and
    // set their values to respective properties in this.element.style.
    // (It works because 'css' has the same properties as
    //  this.element.style, only they are all optional).
    for (const property in css)
    {
      // Skip inherited properties.
      if (!css.hasOwnProperty(property))
        continue;

      const value = css[property];

      if (value !== undefined)
        this.element.style[property] = value;
    }
  }

  // ---------------- Private methods -------------------

  private rememberDisplayMode()
  {
    if (this.element.style.display !== null)
    {
      this.displayMode = this.element.style.display;
    }
  }

  private restoreDisplayMode()
  {
    this.element.style.display = this.displayMode;
  }
}

// ----------------- Auxiliary Functions ---------------------

function clearHtmlContent(element: HTMLElement)
{
  while (element.lastChild !== null)
  {
    element.removeChild(element.lastChild);
  }
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

// ------------------ Type Declarations ----------------------

export namespace Component
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