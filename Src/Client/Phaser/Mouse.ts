import { REPORT } from "../../Shared/Log/REPORT";
import { Vector } from "../../Shared/Physics/Vector";
import { MouseInput } from "../../Shared/Protocol/MouseInput";
import { Connection } from "../../Client/Net/Connection";

export class Mouse
{
  // private lmbDown = false;
  // private rmbDown = false;

  constructor(input: Phaser.Input.InputPlugin)
  {
    // this.mousePointer = input.activePointer;
    this.mousePointer = input.mousePointer;
    this.mouseManager = input.mouse;

    this.mouseManager.disableContextMenu();

    // input.on
    // (
    //   "pointerdown",
    //   (pointer: Phaser.Input.Pointer) => { this.onMouseDown(pointer); }
    // );

    // input.on
    // (
    //   "pointerup",
    //   (pointer: Phaser.Input.Pointer) => { this.onMouseUp(pointer); }
    // );
  }

  private mousePointer: Phaser.Input.Pointer;
  private mouseManager: Phaser.Input.Mouse.MouseManager;

  public isLeftButtonDown() { return this.mousePointer.leftButtonDown(); }
  public isRightButtonDown() { return this.mousePointer.rightButtonDown(); }

  public update()
  {
    sendMouseInput(this.getPosition());
  }

  public getPosition()
  {
    return new Vector({ x: this.mousePointer.x, y: this.mousePointer.y });
  }

  // ---------------- Event handlers --------------------

  /// Zapamatovávat si, kdy je co značknuté, zjevně nemusím - dá
  /// se to číst z phaser pointeru.
  // private onMouseDown(pointer: Phaser.Input.Pointer)
  // {
  //   if (pointer.leftButtonDown())
  //   {
  //     /// TODO.
  //     // Přesunout značku pro target location.
  //     this.lmbDown = true;
  //   }

  //   if (pointer.rightButtonDown())
  //   {
  //     this.rmbDown = true;
  //   }
  // }

  // private onMouseUp(pointer: Phaser.Input.Pointer)
  // {
  //   if (pointer.leftButtonDown())
  //   {
  //     /// TODO:

  //     this.lmbDown = false;
  //   }

  //   if (pointer.rightButtonDown())
  //   {
  //     this.rmbDown = false;
  //   }
  // }
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