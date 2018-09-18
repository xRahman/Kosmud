/*
  Part of Kosmud

  Functionality attached to html document.
*/

'use strict';

import {ERROR} from '../../Shared/Error/ERROR';
import {Client} from '../../Client/Application/Client';
import {Body} from '../../Client/Gui/Body';
import { REPORT } from '../../Shared/Error/REPORT';
// import {Windows} from '../../Client/Gui/Windows';

export class Document
{
  constructor()
  {
    document.addEventListener
    (
      'DOMContentLoaded',
      () => { this.onDocumentReady(); }
    );

    // // Attach handler for 'window.resize' event.
    // $(window).resize
    // (
    //   'resize',
    //   // We call the handler 'onDocumentResize' instead of
    //   // 'onWindowResize' because we use windows inside our
    //   // application.
    //   () => { this.onDocumentResize(); }
    // );

    this.setRootHtmlElementCss();
  }

  // ----------------- Private data ---------------------

  //private body: Body | null = null;
  private body = new Body();

  // --------------- Static accessors -------------------

  // public static get $body() { return ClientApp.document.$body; }

  private setRootHtmlElementCss()
  {
    console.log('Setting CSS to <html>');

    // Seting height of <html> element to 100% is necessary for the
    // <body> element and everything in it to stretch over whole
    // browser viewport (otherwise <body> would match it's height
    // to it's content).
    document.documentElement.style.height = "100%";
    // '!important' is used so that other style won't overrule this
    document.documentElement.style.outline = '0 none';
    document.documentElement.style.margin = '0px';
    document.documentElement.style.padding = "0px";
  }

  // ---------------- Event handlers --------------------

  // This handler is run when web page is completely loaded.
  private onDocumentReady()
  {
    /// Nespouští se - údajně proto, že už je dávno firnutej, když
    /// se začne provádět můj kód. Asi bude lepší se prostě
    // na document.ready vykašlat.
    console.log('onDocumentReady()');
   
    // try
    // {
    //   this.body = new Body();
    // }
    // catch (error)
    // {
    //   REPORT(error, "Failed to init <body> element");
    // }
    
    // // Attach handler for 'keydown' event.
    // $(document).keydown
    // (
    //   (event: JQueryEventObject) => { this.onKeyDown(event); }
    // );

    // Windows.onDocumentReady();
  }

  private onDocumentResize()
  {
    // Windows.onDocumentResize();
  }

  // // Handles 'keydown' event on the document.
  // private onKeyDown(event: JQueryEventObject)
  // {
  //   if (Windows.activeStandaloneWindow)
  //   {
  //     Windows.activeStandaloneWindow.onKeyDown(event);
  //     return;
  //   }

  //   if (Windows.activeScrollWindow)
  //   {
  //     if (ClientApp.state === ClientApp.State.IN_GAME)
  //       Windows.activeScrollWindow.onKeyDown(event);
  //   }
  // }
}