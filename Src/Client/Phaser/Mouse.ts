import {Syslog} from '../../Shared/Log/Syslog';
import {MouseInput} from '../../Shared/Protocol/MouseInput';
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

  try
  {
    Connection.send(new MouseInput(mousePosition.x, mousePosition.y));
  }
  catch (error)
  {
    REPORT(error, "Failed to send mouse input");
  }
}