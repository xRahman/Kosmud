/*
  Part of Kosmud

  Manages interface.
*/

import {Html} from '../../Client/Gui/Html';
import {Body} from '../../Client/Gui/Body';

export class Gui
{
  // -------------- Private static data -----------------

  private static html: Html | "Doesn't exist" = "Doesn't exist";
  private static body: Body | "Doesn't exist" = "Doesn't exist";

  // --------------- Static accessors -------------------

  // ! Throws exception on error.
  public static getBody(): Body
  {
    if (this.body === "Doesn't exist")
    {
      throw new Error("Body component doesn't exist");
    }

    return this.body;
  }

  // ! Throws exception on error.
  public static getHtml(): Html
  {
    if (this.html === "Doesn't exist")
    {
      throw new Error("Html component doesn't exist");
    }

    return this.html;
  }

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static init()
  {
    // ! Throws exception on error.
    this.initHtmlComponent();

    // ! Throws exception on error.
    this.initBodyComponent();
  }

  // ! Throws exception on error.
  private static initHtmlComponent()
  {
    if (this.html !== "Doesn't exist")
    {
      throw new Error("Failed to init <html> component"
        + " because it already exists");
    }

    // 'document.documentElement' is a direct reference to <html> element.
    if (!document.documentElement)
    {
      throw new Error("Failed to init <html> component"
        + " because it doesn't exist in the DOM");
    }

    this.html = new Html(document.documentElement);
  }


  // ! Throws exception on error.
  private static initBodyComponent()
  {
    if (this.body !== "Doesn't exist")
    {
      throw new Error("Failed to init <body> component"
        + " because it already exists");
    }

    this.body = new Body(document.body);
  }
}