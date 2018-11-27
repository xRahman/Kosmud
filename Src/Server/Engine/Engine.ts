/*
  Part of Kosmud

  Server part of game engine.
*/

import { ERROR } from "../../Shared/Log/ERROR";
import { Syslog } from "../../Shared/Log/Syslog";
import { Types } from "../../Shared/Utils/Types";
import { Physics } from "../../Shared/Physics/Physics";
import { Game } from "../../Server/Game/Game";
import * as Shared from "../../Shared/Engine/Engine";

let loopInterval: NodeJS.Timeout | "Not looping" = "Not looping";
let finishLoop: Types.ResolveFunction<void> | "Not looping" = "Not looping";

export namespace Engine
{
  export async function loop()
  {
    loopInterval = setInterval
    (
      () => { tick(Shared.Engine.TICK_MILISECONDS); },
      Shared.Engine.TICK_MILISECONDS
    );

    return new Promise<void>((resolve, reject) => { finishLoop = resolve; });
  }

  export function shutdown()
  {
    if (loopInterval === "Not looping" || finishLoop === "Not looping")
    {
      ERROR(`Attempt to shutdown the server when it's not running`);
      return;
    }

    clearInterval(loopInterval);
    finishLoop();
  }
}

// ----------------- Auxiliary Functions ---------------------

function tick(miliseconds: number)
{
  try
  {
    Game.tick();
    Physics.tick(miliseconds);
    Game.updateClients();
  }
  catch (error)
  {
    Syslog.reportUncaughtException(error);
  }
}