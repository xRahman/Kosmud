/*
  Part of Kosmud

  Incoming keyboard input packet.

  (Part of client-server communication protocol.)
*/

import { Syslog } from "../../Shared/log/Syslog";
import { Connection } from "../../Server/Net/Connection";
import { Game } from "../../Server/Game/Game";
import * as Shared from "../../Shared/Protocol/KeyboardInput";

export class KeyboardInput extends Shared.KeyboardInput
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    switch (this.startOrStop)
    {
      case "Start":
        startMovingShip(this.action);
        break;

      case "Stop":
        stopMovingShip(this.action);
        break;

      default:
        throw Syslog.reportMissingCase(this.startOrStop);
    }
  }
}

// This class is registered in Server/Net/Connection.

// ----------------- Auxiliary Functions ---------------------

function startMovingShip(action: Shared.KeyboardInput.Action)
{
  switch (action)
  {
    case "Left":
      Game.ship.startTurningLeft();
      break;

    case "Right":
      Game.ship.startTurningRight();
      break;

    case "Forward":
      Game.ship.moveForward();
      break;

    case "Backward":
      Game.ship.moveBackward();
      break;

    default:
      throw Syslog.reportMissingCase(action);
  }
}

function stopMovingShip(action: Shared.KeyboardInput.Action)
{
  switch (action)
  {
    case "Left":
    case "Right":
      Game.ship.stopTurning();
      break;

    case "Forward":
    case "Backward":
      Game.ship.stopMoving();
      break;

    default:
      throw Syslog.reportMissingCase(action);
  }
}