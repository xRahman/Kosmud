import { Keyboard } from "../../Client/Engine/Keyboard";
import { Scene } from "../../Client/Engine/Scene";
import { Camera } from "../../Client/Engine/Camera";
import { Mouse } from "../../Client/Engine/Mouse";

export class SceneContents
{
  // public cursors = this.scene.input.keyboard.createCursorKeys();
  public camera: Camera;
  /// TODO: Potřebují všechny scény keyboard a mouse? Možná ne...
  /// (v tom případě to odtud vyhodit a dát to jen tam, kde je to potřeba).
  public keyboard: Keyboard;
  public mouse: Mouse;

  constructor(scene: Scene, canvasWidth: number, canvasHeight: number)
  {
    this.camera = new Camera(scene);
    this.keyboard = new Keyboard(scene.input.keyboard);
    this.mouse = new Mouse(scene.input);
  }
}