/*
  Part of Kosmud

  Incoming player input packet.
*/

'use strict';

import {Utils} from '../../Shared/Utils/Utils';
import {Connection} from '../../Server/Net/Connection';
import {Game} from '../../Server/Game/Game';
import * as Shared from '../../Shared/Protocol/PlayerInput';

export class PlayerInput extends Shared.PlayerInput
{
  constructor
  (
    protected action: Shared.PlayerInput.Action,
    protected startOrStop: Shared.PlayerInput.StartOrStop
  )
  {
    super(action, startOrStop);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    switch (this.startOrStop)
    {
      case "Start":
        this.startMovingShip();
        break;

      case "Stop":
        this.stopMovingShip();
        break;

      default:
        // Compiler error "Argument of type '"xy"' is not assignable to para-
        // meter of type 'never'" means there is a case missing in this switch.
        Utils.reportMissingCase(this.startOrStop);
    }
  }

  // --------------- Private methods --------------------

  private startMovingShip()
  {
    switch (this.action)
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
        // Compiler error "Argument of type '"xy"' is not assignable to para-
        // meter of type 'never'" means there is a case missing in this switch.
        Utils.reportMissingCase(this.action);
    }
  }

  private stopMovingShip()
  {
    switch (this.action)
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
        // Compiler error "Argument of type '"xy"' is not assignable to para-
        // meter of type 'never'" means there is a case missing in this switch.
        Utils.reportMissingCase(this.action);
    }
  }
}