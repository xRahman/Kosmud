/*
  Part of Kosmud

  Manages interface.
*/

import { Html } from "../../Client/Gui/Html";
import { Body } from "../../Client/Gui/Body";

let html: Html | "Doesn't exist" = "Doesn't exist";
let body: Body | "Doesn't exist" = "Doesn't exist";

export namespace Gui
{
  // ! Throws exception on error.
  export function getBody(): Body
  {
    if (body === "Doesn't exist")
    {
      throw Error("Body component doesn't exist");
    }

    return body;
  }

  // ! Throws exception on error.
  export function getHtml(): Html
  {
    if (html === "Doesn't exist")
    {
      throw Error("Html component doesn't exist");
    }

    return html;
  }

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  export function init()
  {
    // ! Throws exception on error.
    initHtmlComponent();

    // ! Throws exception on error.
    initBodyComponent();
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function initHtmlComponent()
{
  if (html !== "Doesn't exist")
  {
    throw Error("Failed to init <html> component"
      + " because it already exists");
  }

  // 'document.documentElement' is a direct reference to <html> element.
  if (document.documentElement === null)
  {
    throw Error("Failed to init <html> component"
      + " because it doesn't exist in the DOM");
  }

  html = new Html(document.documentElement);
}

// ! Throws exception on error.
function initBodyComponent()
{
  if (body !== "Doesn't exist")
  {
    throw Error("Failed to init <body> component"
      + " because it already exists");
  }

  body = new Body(document.body);
}