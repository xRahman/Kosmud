/*
  Part of Kosmud

  Functionality attached to html document.
*/

// import {ERROR} from '../../Shared/Error/ERROR';
// import { REPORT } from '../../Shared/Error/REPORT';
// import {Client} from '../../Client/Application/Client';
import {Html} from '../../Client/Gui/Html';
import {Body} from '../../Client/Gui/Body';
// import {Windows} from '../../Client/Gui/Windows';

// This does nothing, it's here only to mark these modules as 'used'.
// (We need to import them from somewhere to inicialize them).
Html;
Body;

export class Document
{
  constructor()
  {
    window.addEventListener('resize', () => { this.onDocumentResize(); });
  }

  // ----------------- Private data ---------------------

  // --------------- Static accessors -------------------

  // ---------------- Event handlers --------------------

  private onDocumentResize()
  {
    // Windows.onDocumentResize();
  }
}