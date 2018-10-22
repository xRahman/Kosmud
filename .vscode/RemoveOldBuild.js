/*
  Part of Kosmud

  Removes old build.
*/

'use strict';

const fs = require('fs');

console.log('Removing old build...');

rmTree("./Client/js/Client");
rmTree("./Client/js/Shared");
rmTree("./Server/js/Server");
rmTree("./Server/js/Shared");

// Removes directory 'path' even if it's not empty.
function rmTree(path)
{
  if (fs.existsSync(path))
  {
    fs.readdirSync(path).forEach
    (
      function(file)
      {
        let currentPath = path + "/" + file;

        if (fs.statSync(currentPath).isDirectory())
        {
          // Recurse.
          rmTree(currentPath);
        }
        else
        {
          // Delete file.
          fs.unlinkSync(currentPath);
        }
      }
    );

    fs.rmdirSync(path);
  }
};