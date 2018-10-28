/*
  Wraps Phaser.GameObjects.Container
*/

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Phaser/Sprite";
import { Graphics } from "../../Client/Phaser/Graphics";

export class Container
{
  private container: Phaser.GameObjects.Container;

  constructor
  (
    private scene: Phaser.Scene,
    x: number,
    y: number
  )
  {
    this.container = scene.add.container(x, y);
  }

  // ---------------- Public methods --------------------

  public getWidth() { return this.container.width; }
  public getHeight() { return this.container.height; }

  public setX(x: number)
  {
    this.container.setX(x);
  }

  public setY(y: number)
  {
    // Note: Coordinates transform ('y' axis is inverted).
    this.container.setY(-y);
  }

  public setPosition(position: Vector)
  {
    this.setX(position.x);
    this.setY(position.y);
  }

  public getPosition()
  {
    // Note: Coordinates transform ('y' axis is inverted).
    return new Vector({ x: this.container.x, y: -this.container.y });
  }

  public setRotation(rotation: number)
  {
    // Note: Coordinates transform (rotation is inverted).
    this.container.setRotation(-rotation);
  }

  public setDepth(depth: number) { this.container.setDepth(depth); }

  public setScrollFactor(scrollFactor: number)
  {
    this.container.setScrollFactor(scrollFactor);
  }

  public setDisplaySize(width: number, height: number)
  {
    this.container.setDisplaySize(width, height);
  }

  public setVisible(visibility: boolean)
  {
    this.container.setVisible(visibility);
  }

  public addSprite(sprite: Sprite)
  {
    sprite.addToContainer(this.container);
  }

  public addGraphics(graphics: Graphics)
  {
    graphics.addToContainer(this.container);
  }
}