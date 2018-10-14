/*
  Part of Kosmud

  Incoming player input packet.

  (Part of client-server communication protocol.)
*/

import {Utils} from '../../Shared/Utils/Utils';
import {Connection} from '../../Server/Net/Connection';
import {Game} from '../../Server/Game/Game';
import * as Shared from '../../Shared/Protocol/PlayerInput';

export class PlayerInput extends Shared.PlayerInput
{
  constructor(input: Shared.PlayerInput.Action | Shared.PlayerInput.MouseMove)
  {
    super(input);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    switch (this.input.inputType)
    {
      case "Action":
        this.processPlayerAction(this.input)
        break;

      case "Mouse move":
        this.processMouseMove(this.input)
        break;

      default:
        Utils.reportMissingCase(this.input);
    }
  }

  // --------------- Private methods --------------------

  private processMouseMove(mouseMove: Shared.PlayerInput.MouseMove)
  {
    Game.ship.seekPosition(mouseMove);
  }

  private processPlayerAction(action: Shared.PlayerInput.Action)
  {
    switch (action.startOrStop)
    {
      case "Start":
        this.startMovingShip(action.actionType);
        break;

      case "Stop":
        this.stopMovingShip(action.actionType);
        break;

      default:
        Utils.reportMissingCase(action.startOrStop);
    }
  }

  private startMovingShip(actionType: Shared.PlayerInput.ActionType)
  {
    switch (actionType)
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
        Utils.reportMissingCase(actionType);
    }
  }

  private stopMovingShip(actionType: Shared.PlayerInput.ActionType)
  {
    switch (actionType)
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
        Utils.reportMissingCase(actionType);
    }
  }
}

// This class is registered in Server/Net/Connection.