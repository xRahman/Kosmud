/*
  Part of Kosmud

  <body> element.
*/

'use strict';

import {Component} from '../../Client/Gui/Component';

const BODY_ELEMENT_ID = 'body';

export class Body extends Component
{
  // ! Throws an exception on error.
  constructor()
  {
    super();

    // ! Throws an exception on error.
    this.element = getBodyElement();
    this.setCss(Body.css);
  }

  protected static css: Partial<CSSStyleDeclaration> =
  {
    outline: '0 none',
    margin: '0px',
    padding: '0px',
    width: '100%',
    height: '100%',
    minHeight: '100%',
    minWidth: '100%',
    position: 'absolute',

    // Disable text selection.
    webkitUserSelect: 'none',
    userSelect: 'none',

    // Set default cursor.
    // (otherwise text select cursor would appear on
    //  components with disabled text selection)
    cursor: 'default'
  }

  // ----------------- Private data ---------------------

  // --------------- Static accessors -------------------

  // ---------------- Event handlers --------------------

  // ---------------- Private methods -------------------
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws an exception on error.
function getBodyElement()
{
  let body = document.getElementById(BODY_ELEMENT_ID);

  if (!body)
  {
    throw new Error
    (
      "Unable to find <body> element by id '" + BODY_ELEMENT_ID + "'"
    );
  }

  return body;
}