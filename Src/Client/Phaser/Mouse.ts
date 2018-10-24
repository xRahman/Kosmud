import { REPORT } from "../../Shared/Log/REPORT";
import { Vector } from "../../Shared/Physics/Vector";
import { MouseInput } from "../../Shared/Protocol/MouseInput";
import { Connection } from "../../Client/Net/Connection";

export class Mouse
{
  constructor(input: Phaser.Input.InputPlugin)
  {
    this.mousePointer = input.activePointer;
    this.mouseManager = input.mouse;

    this.mouseManager.disableContextMenu();

    input.on
    (
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => { onMouseDown(pointer); }
    );

    input.on
    (
      "pointerup",
      (pointer: Phaser.Input.Pointer) => { onMouseUp(pointer); }
    );
  }

  private mousePointer: Phaser.Input.Pointer;
  private mouseManager: Phaser.Input.Mouse.MouseManager;

  public update()
  {
    sendMouseInput(this.getMousePosition());
  }

  private getMousePosition()
  {
    return new Vector({ x: this.mousePointer.x, y: this.mousePointer.y });
  }
}

// ----------------- Auxiliary Functions ---------------------

function sendMouseInput(mousePosition: Vector)
{
  /// TODO: All keyboard event handling should be disabled when
  /// the player gets disconnected (reconnect window should be
  /// shown instead).
  ///   For now, we just avoid sending packets to closed connection.
  if (!Connection.isOpen())
    return;

  try
  {
    Connection.send(new MouseInput(mousePosition));
  }
  catch (error)
  {
    REPORT(error, "Failed to send mouse input");
  }
}

// ---------------- Event handlers --------------------

function onMouseDown(pointer: Phaser.Input.Pointer)
{
  if (pointer.leftButtonDown())
  {
    /// TODO.
  }
}

function onMouseUp(pointer: Phaser.Input.Pointer)
{
  if (pointer.leftButtonDown())
  {
    /// TODO:
  }
}