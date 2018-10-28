/*
  Wraps Phaser.GameObjects.Sprite
*/

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { Vector } from "../../Shared/Physics/Vector";

export class Sprite
{
  private sprite: Phaser.GameObjects.Sprite;

  constructor
  (
    private scene: Phaser.Scene,
    x: number,
    y: number,
    textureId: string
  )
  {
    this.sprite = scene.add.sprite(x, y, textureId);
  }

  // ---------------- Public methods --------------------

  public getWidth() { return this.sprite.width; }
  public getHeight() { return this.sprite.height; }

  public setX(x: number)
  {
    this.sprite.setX(x);
  }

  public setY(y: number)
  {
    // Note: Coordinates transform ('y' axis is inverted).
    this.sprite.setY(-y);
  }

  public setPosition(position: Vector)
  {
    this.setX(position.x);
    this.setY(position.y);
  }

  public setDepth(depth: number) { this.sprite.setDepth(depth); }

  public setScrollFactor(scrollFactor: number)
  {
    this.sprite.setScrollFactor(scrollFactor);
  }

  public setDisplaySize(width: number, height: number)
  {
    this.sprite.setDisplaySize(width, height);
  }

  public setVisible(visibility: boolean)
  {
    this.sprite.setVisible(visibility);
  }

  public addToContainer(container: Phaser.GameObjects.Container)
  {
    container.add(this.sprite);
  }
}