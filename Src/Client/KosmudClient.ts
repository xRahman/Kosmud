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
import {Gui} from '../Client/Gui/Gui';
import {Renderer} from '../Client/Phaser/Renderer';
import {Connection} from '../Client/Net/Connection';

function start()
{
  Syslog.log("[INFO]", "Starting Kosmud client...");

  try
  {
    Gui.init();
    Renderer.init();
    Connection.connect(); 
  }
  catch (error)
  {
    REPORT(error, "Failed to start the client");
    alert("Failed to start (" + error.message + ")");
  }
}

start();