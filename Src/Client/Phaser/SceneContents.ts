import {Keyboard} from '../../Client/Phaser/Keyboard';
import {Scene} from '../../Client/Phaser/Scene';
import {Camera} from '../../Client/Phaser/Camera';
import {Mouse} from '../../Client/Phaser/Mouse';

export class SceneContents
{
  constructor(scene: Scene, canvasWidth: number, canvasHeight: number)
  {
    this.camera = new Camera(scene);
    this.keyboard = new Keyboard(scene.input.keyboard);
    this.mouse = new Mouse(scene.input.activePointer, scene.input.mouse);
  }

  // ----------------- Public data ----------------------
 
  // public cursors = this.scene.input.keyboard.createCursorKeys();
  public camera: Camera;
  /// TODO: Potřebují všechny scény keyboard a mouse? Možná ne...
  /// (v tom případě to odtud vyhodit a dát to jen tam, kde je to potřeba).
  public keyboard: Keyboard;
  public mouse: Mouse;
}