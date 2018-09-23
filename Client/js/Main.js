/*
  Part of BrutusNEXT

  Initializes module loader (requirejs), launches KosmudClient.
*/

'use strict';

// Variable is actually declared in require.js,
// we just let typescript know that it exists.
var requirejs;

requirejs.config
(
  {
    paths:
    {
      // // Alias so that you can use 'import $ = require('jquery');'.
      // 'jquery': '../js/jquery/jquery.slim',
      // // Alias so that you can use 'import d3 = require('d3');'.
      // 'd3': '../js/d3/d3.min',
      'js-beautify': '../js/js-beautify/beautify',
      'fastbitset': '../js/fastbitset/FastBitSet'
      // 'phaser': '../js/phaser/phaser'
    }
  }
);

///console.log('Main.js');

// If I don't reuire 3rd party modules here, I get error like:
//   Uncaught Error: Module name "js-beautify" has not
//   been loaded yet for context: _
require(['js-beautify']);
require(['fastbitset']);
// require(['phaser']);

// Launch the client.
require(['./Client/KosmudClient']);
