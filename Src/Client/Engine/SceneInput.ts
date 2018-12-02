import { Keyboard } from "../../Client/Engine/Keyboard";
import { Mouse } from "../../Client/Engine/Mouse";

export abstract class SceneInput
{
  // public cursors = this.scene.input.keyboard.createCursorKeys();
  protected keyboard: Keyboard;
  protected mouse: Mouse;

  constructor(input: Phaser.Input.InputPlugin)
  {
    this.keyboard = new Keyboard(input.keyboard);
    this.mouse = new Mouse(input);
  }
}