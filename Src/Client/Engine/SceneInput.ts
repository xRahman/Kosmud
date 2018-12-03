import { Keyboard } from "../../Client/Engine/Keyboard";
import { Mouse } from "../../Client/Engine/Mouse";
import { Scene } from "../../Client/Engine/Scene";

export abstract class SceneInput
{
  // public cursors = this.scene.input.keyboard.createCursorKeys();
  protected keyboard: Keyboard;
  protected mouse: Mouse;

  constructor(protected readonly scene: Scene)
  {
    this.keyboard = scene.createKeyboard();
    this.mouse = scene.createMouse();
  }
}