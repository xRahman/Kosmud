/*
  Part of Kosmud

  Functionality attached to html document.
*/

'use strict';

// import {ERROR} from '../../Shared/Error/ERROR';
// import { REPORT } from '../../Shared/Error/REPORT';
// import {Client} from '../../Client/Application/Client';
import {Html} from '../../Client/Gui/Html';
import {Body} from '../../Client/Gui/Body';
// import {Windows} from '../../Client/Gui/Windows';

export class Document
{
  constructor()
  {
    window.addEventListener('resize', () => { this.onDocumentResize(); });
  }

  // ----------------- Private data ---------------------

  // <body> element.
  private body = new Body();
  // <html> element.
  private html = new Html();

  // --------------- Static accessors -------------------

  // ---------------- Event handlers --------------------

  private onDocumentResize()
  {
    // Windows.onDocumentResize();
  }
}