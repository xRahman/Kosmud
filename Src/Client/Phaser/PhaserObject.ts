/*
  Abstract ancestor of Phaser game object warappers.
*/

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { Vector } from "../../Shared/Physics/Vector";

// Phaser.GameObjects.GameObject technicaly is an ancestor of
// Sprite, Container, Graphics etc., but we need to use common
// metods of such phaser objects that are not present on it.
//   The solution is to declare the interface ourselves.
interface PhaserGameObject extends Phaser.GameObjects.GameObject
{
  setX(x: number): void;
  setY(y: number): void;
  x: number;
  y: number;
  setRotation(rotation: number): void;
  setDepth(depth: number): void;
  setScrollFactor(scrollFactor: number): void;
  setVisible(visibility: boolean): void;
}

export abstract class PhaserObject
{
  protected abstract phaserObject: PhaserGameObject;

  constructor(protected scene: Phaser.Scene) {}

  // ------------ Protected static methods --------------

  protected static transformPolygon(polygon: Array<{ x: number; y: number }>)
  {
    const result = [];

    for (const point of polygon)
    {
      // Note: Coordinates transform ('y' axis is inverted).
      result.push({ x: point.x, y: -point.y });
    }

    return result;
  }

  protected static transformVector(vector: Vector)
  {
    // Note: Coordinates transform ('y' axis is inverted).
    return new Vector({ x: vector.x, y: -vector.y });
  }

  // ---------------- Public methods --------------------

  public setX(x: number)
  {
    this.phaserObject.setX(x);
  }

  public setY(y: number)
  {
    // Note: Coordinates transform ('y' axis is inverted).
    this.phaserObject.setY(-y);
  }

  public setRotation(rotation: number)
  {
    // Note: Coordinates transform (rotation is inverted).
    this.phaserObject.setRotation(-rotation);
  }

  public setPosition(position: Vector)
  {
    this.setX(position.x);
    this.setY(position.y);
  }

  public getPosition()
  {
    // Note: Coordinates transform ('y' axis is inverted).
    return new Vector({ x: this.phaserObject.x, y: -this.phaserObject.y });
  }

  public setDepth(depth: number)
  {
    this.phaserObject.setDepth(depth);
  }

  public setScrollFactor(scrollFactor: number)
  {
    this.phaserObject.setScrollFactor(scrollFactor);
  }

  public setVisible(visibility: boolean)
  {
    this.phaserObject.setVisible(visibility);
  }

  public addToContainer(container: Phaser.GameObjects.Container)
  {
    container.add(this.phaserObject);
  }
}