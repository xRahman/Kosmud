/*
  Part of Kosmud

  <body> html element.
*/

'use strict';

import {Client} from '../../Client/Application/Client';
import { ERROR } from '../../Shared/Error/ERROR';
// import {Windows} from '../../Client/Gui/Windows';

export class Body
{
  // ! Throws an exception on error.
  constructor()
  {
    let id = 'body';
    let body = document.getElementById(id);

    if (!body)
      throw new Error("Unable to find <body> element by id '" + id + "'");

    this.element = body;

    this.applyCSS();
  }

  // ----------------- Private data ---------------------

  private element: HTMLElement;

  // --------------- Static accessors -------------------

  // ---------------- Event handlers --------------------

  // ---------------- Private methods -------------------

  private applyCSS()
  {
    console.log('Setting CSS to <body>');

    /// TODO: Předělat to na zápis přímo do properties elementu
    /// (místo setování přes jména atributů).

    // '!important' is used so that other style won't overrule this
    this.element.setAttribute('outline', '0 none !important;');

    this.element.setAttribute('outline', '0 none !important;');
    // Margin is defined to ensure the same behaviour in all browsers
    this.element.setAttribute('margin', '0 !important;');
    // Padding: 0 is defined to ensure the same behaviour in all browsers
    this.element.setAttribute('padding', '0 !important;');
    
    this.element.setAttribute('width', '100%;');
    this.element.setAttribute('height', '100%;');
    this.element.setAttribute('min-height', '100%;');
    this.element.setAttribute('min-width', '100%;');
    this.element.setAttribute('position', 'absolute;');
    // this.element.setAttribute('display', 'flex;');
    this.element.setAttribute('background-color', 'black;');
    // this.element.setAttribute('background-image', 'url(/images/background-landscape.jpg);');

    /* Fonts are saved on server so we don't need alternatives */
    // this.element.setAttribute('font-family', 'CourierNew;');

    /* Base font size, all other sizes are relative to this */
      /* 
        If we wanted to allow users to change font size, we should
          set this attribute so all fonts scale accordingly.
      */
    this.element.setAttribute('font-size', '1em; /* Browser default (usually 16px) */');

    /* Disable text selection */
    // this.element.setAttribute('-khtml-user-select', 'none;');
    // this.element.setAttribute('-moz-user-select', 'none;');
    // this.element.setAttribute('-webkit-user-select', 'none;');
    // this.element.setAttribute('-ms-user-select', 'none;');
    // this.element.setAttribute('-o-user-select', 'none;');
    this.element.setAttribute('user-select', 'none;');

    /*
      Set default cursor
      (otherwise text select cursor would appear on components
      with disabled text selection)
    */
    this.element.setAttribute('cursor', 'default;');

    /* Following code makes the background image always cover whole area */
    // this.element.setAttribute('background-repeat', 'no-repeat;');
    // this.element.setAttribute('background-attachment', 'fixed;');
    // this.element.setAttribute('background-position', 'center;');
    // this.element.setAttribute('-webkit-background-size', 'cover;');
    // this.element.setAttribute('-moz-background-size', 'cover;');
    // this.element.setAttribute('-o-background-size', 'cover;');
    // this.element.setAttribute('background-size', 'cover;');
  }
}