/*
                _  __                             _ 
               | |/ /                            | |
               | ' / ___  ___ _ __ ___  _   _  __| |
               |  < / _ \/ __| '_ ` _ \| | | |/ _` |
               | . \ (_) \__ \ | | | | | |_| | (_| |
               |_|\_\___/|___/_| |_| |_|\__,_|\__,_|


                     Client program entry point
*/

import {REPORT} from '../Shared/Log/REPORT';
import {Syslog} from '../Client/Log/Syslog';
import {PhaserEngine} from '../Client/Phaser/PhaserEngine';
import {Html} from '../Client/Gui/Html';
import {Connection} from '../Client/Net/Connection';

/// TODO: Přesunout tohle do nějaké init() metody.
PhaserEngine;   // Inits the class.

function start()
{
  Syslog.log("[INFO]", "Starting Kosmud client...");

  try
  {
    Html.init();
  }
  catch (error)
  {
    REPORT(error, "Failed to init GUI");
    alert("Failed to init GUI");
    return;
  }

  try
  {
    Connection.connect();
  }
  catch (error)
  {
    REPORT(error, "Failed to connect to the server");
    alert("Failed to connect to the server: " + error.message);
    return;
  }
}

start();