import {Syslog} from '../../Shared/Log/Syslog';
import {PlayerInput} from '../../Shared/Protocol/PlayerInput';
import {Connection} from '../../Client/Net/Connection';
import {REPORT} from '../../Shared/Log/REPORT';

export class Mouse
{
  constructor
  (
    private mousePointer: Phaser.Input.Pointer,
    private mouseManager: Phaser.Input.Mouse.MouseManager
  )
  {
  }

  public update()
  {
    sendMouseInput(this.getMousePosition());
  }

  private getMousePosition()
  {
    return { x: this.mousePointer.x, y: this.mousePointer.y };
  }
}

// ----------------- Auxiliary Functions ---------------------

function sendMouseInput(mousePosition: { x: number, y: number })
{
  /// TODO: All keyboard event handling should be disabled when
  /// the player gets disconnected (reconnect window should be
  /// shown instead).
  ///   For now, we just avoid sending packets to closed connection.
  if (!Connection.isOpen())
    return;

  const input: PlayerInput.MouseMove =
  {
    inputType: "Mouse move",
    x: mousePosition.x,
    y: mousePosition.y
  };

  try
  {
    Connection.send(new PlayerInput(input));
  }
  catch (error)
  {
    REPORT(error, "Failed to send mouse input");
  }
}