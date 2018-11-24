/*
  Abstract ancestor of Phaser game object warappers.
*/

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { CoordsTransform } from "../../Shared/Physics/CoordsTransform";
import { Scene } from "../../Client/Engine/Scene";

// Phaser.GameObjects.GameObject technicaly is an ancestor of
// Sprite, Container, Graphics etc., but we need to use common
// metods of such phaser objects that are not present on it.
//   The solution is to declare the interface ourselves.
interface PhaserGameObject extends Phaser.GameObjects.GameObject
{
  x: number;
  y: number;
  rotation: number;
  setX(x: number): void;
  setY(y: number): void;
  setRotation(rotation: number): void;
  setDepth(depth: number): void;
  setScrollFactor(scrollFactor: number): void;
  setVisible(visibility: boolean): void;
}

export abstract class PhaserObject
{
  protected abstract phaserObject: PhaserGameObject;

  constructor(protected scene: Scene) {}

  // ---------------- Public methods --------------------

  public setRotation(rotation: number)
  {
    this.phaserObject.setRotation(CoordsTransform.transformAngle(rotation));
  }

  public getRotation()
  {
    return CoordsTransform.transformAngle(this.phaserObject.rotation);
  }

  public setPosition(position: { x: number; y: number })
  {
    const transformedPosition = CoordsTransform.transformVector(position);

    this.phaserObject.setX(transformedPosition.x);
    this.phaserObject.setY(transformedPosition.y);
  }

  public getPosition()
  {
    return CoordsTransform.transformVector(this.phaserObject);
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