/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { REPORT } from "../../Shared/Log/REPORT";
import { Vector } from "../../Shared/Physics/Vector";
import { MouseInput } from "../../Shared/Protocol/MouseInput";
import { Connection } from "../../Client/Net/Connection";
import { Coords } from "../../Shared/Engine/Coords";

export class Mouse
{
  private readonly mousePointer: Phaser.Input.Pointer;
  private readonly mouseManager: Phaser.Input.Mouse.MouseManager;

  // private leftButtonDown = false;
  // private middleButtonDown = false;
  // private rightButtonDown = false;

  constructor(input: Phaser.Input.InputPlugin)
  {
    this.mousePointer = input.activePointer;
    this.mouseManager = input.mouse;

    // this.mouseManager.disableContextMenu();

    /// TODO: Případný callbacky provolávat vejš do SceneInputu,
    /// ať se nemusí ve zděděných přetěžovat jak SceneInput, tak Mouse.

    // input.on
    // (
    //   "pointerup",
    //   (pointer: Phaser.Input.Pointer) => { this.onPointerUp(pointer); }
    // );

    // input.on
    // (
    //   "pointerdown",
    //   (pointer: Phaser.Input.Pointer) => { this.onPointerDown(pointer); }
    // );

    // input.on
    // (
    //   "pointermove",
    //   (pointer: Phaser.Input.Pointer) => { this.onPointerMove(pointer); }
    // );
  }

  public isLeftButtonDown() { return this.mousePointer.leftButtonDown(); }
  public isMiddleButtonDown() { return this.mousePointer.middleButtonDown(); }
  public isRightButtonDown() { return this.mousePointer.rightButtonDown(); }

  public update()
  {
    sendMouseInput(this.getPosition());
  }

  public getPosition()
  {
    return Coords.ClientToServer.vector
    (
      { x: this.mousePointer.x, y: this.mousePointer.y }
    );
  }

  // ---------------- Event handlers --------------------

  // private onPointerUp(pointer: Phaser.Input.Pointer)
  // {
  //   if (pointer.leftButtonDown())
  //     this.leftButtonDown = false;

  //   if (pointer.middleButtonDown())
  //     this.middleButtonDown = false;

  //   if (pointer.rightButtonDown())
  //     this.rightButtonDown = false;
  // }

  // private onPointerDown(pointer: Phaser.Input.Pointer)
  // {
  //   if (pointer.leftButtonDown())
  //     this.leftButtonDown = true;

  //   if (pointer.middleButtonDown())
  //     this.middleButtonDown = true;

  //   if (pointer.rightButtonDown())
  //     this.rightButtonDown = true;
  // }

  // private onPointerMove(pointer: Phaser.Input.Pointer)
  // {
  //   this.leftButtonDown = pointer.leftButtonDown();

  //   this.middleButtonDown = pointer.middleButtonDown();

  //   this.rightButtonDown = pointer.rightButtonDown();
  // }
}

// ----------------- Auxiliary Functions ---------------------

function sendMouseInput(mousePosition: Vector)
{
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