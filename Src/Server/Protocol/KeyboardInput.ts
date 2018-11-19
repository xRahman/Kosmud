/*
  Part of Kosmud

  Incoming keyboard input packet.

  (Part of client-server communication protocol.)
*/

// import { Syslog } from "../../Shared/log/Syslog";
import { Connection } from "../../Server/Net/Connection";
import * as Shared from "../../Shared/Protocol/KeyboardInput";

export class KeyboardInput extends Shared.KeyboardInput
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  // tslint:disable-next-line:prefer-function-over-method
  public async process(connection: Connection)
  {
    console.log("Keyboard input processing is disabled for now");
    // switch (this.startOrStop)
    // {
    //   case "Start":
    //     startMovingShip(this.action);
    //     break;

    //   case "Stop":
    //     stopMovingShip(this.action);
    //     break;

    //   default:
    //     throw Syslog.reportMissingCase(this.startOrStop);
    // }
  }
}

// This class is registered in Server/Net/Connection.

// ----------------- Auxiliary Functions ---------------------

// // ! Throws exception on error.
// function startMovingShip(action: Shared.KeyboardInput.Action)
// {
//   switch (action)
//   {
//     case "Left":
//       // ! Throws exception on error.
//       Game.getPlayerShip().startTurningLeft();
//       break;

//     case "Right":
//       // ! Throws exception on error.
//       Game.getPlayerShip().startTurningRight();
//       break;

//     case "Forward":
//       // ! Throws exception on error.
//       Game.getPlayerShip().moveForward();
//       break;

//     case "Backward":
//       // ! Throws exception on error.
//       Game.getPlayerShip().moveBackward();
//       break;

//     default:
//       throw Syslog.reportMissingCase(action);
//   }
// }

// // ! Throws exception on error.
// function stopMovingShip(action: Shared.KeyboardInput.Action)
// {
//   switch (action)
//   {
//     case "Left":
//     case "Right":
//       // ! Throws exception on error.
//       Game.getPlayerShip().stopTurning();
//       break;

//     case "Forward":
//     case "Backward":
//       // ! Throws exception on error.
//       Game.getPlayerShip().stopMoving();
//       break;

//     default:
//       throw Syslog.reportMissingCase(action);
//   }
// }