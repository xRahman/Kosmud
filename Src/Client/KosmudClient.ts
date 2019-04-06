/*
                _  __                             _
               | |/ /                            | |
               | ' / ___  ___ _ __ ___  _   _  __| |
               |  < / _ \/ __| '_ ` _ \| | | |/ _` |
               | . \ (_) \__ \ | | | | | |_| | (_| |
               |_|\_\___/|___/_| |_| |_|\__,_|\__,_|

                     Client program entry point
*/

import { REPORT } from "../Shared/Log/REPORT";
import { Syslog } from "../Client/Log/Syslog";
import { Gui } from "../Client/Gui/Gui";
import { Renderer } from "../Client/Engine/Renderer";
import { Connection } from "../Client/Net/Connection";

/// HACK: Neregistrovala se mi root prototype entita.
import "../Client/Game/Zone";
import "../Client/Asset/TextureAsset";
import "../Client/Asset/TextureAtlasAsset";

async function start()
{
  Syslog.log("[INFO]", "Starting Kosmud client...");

  try
  {
    Gui.init();
    await Renderer.init();
    Connection.connect();
  }
  catch (error)
  {
    REPORT(error, "Failed to start the client");
    alert(`Failed to start`);
  }
}

// tslint:disable-next-line:no-floating-promises
start();