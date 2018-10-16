/*
  Part of Kosmud

  Incoming keyboard input packet.

  (Part of client-server communication protocol.)
*/

import {Utils} from '../../Shared/Utils/Utils';
import {Connection} from '../../Server/Net/Connection';
import {Game} from '../../Server/Game/Game';
import * as Shared from '../../Shared/Protocol/KeyboardInput';

export class KeyboardInput extends Shared.KeyboardInput
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    switch (this.startOrStop)
    {
      case "Start":
        this.startMovingShip(this.action);
        break;

      case "Stop":
        this.stopMovingShip(this.action);
        break;

      default:
        Utils.reportMissingCase(this.startOrStop);
    }
  }

  // --------------- Private methods --------------------

  private startMovingShip(action: Shared.KeyboardInput.Action)
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
        Utils.reportMissingCase(action);
    }
  }

  private stopMovingShip(action: Shared.KeyboardInput.Action)
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
        Utils.reportMissingCase(action);
    }
  }
}

// This class is registered in Server/Net/Connection.