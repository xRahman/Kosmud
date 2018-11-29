/*
  Abstract ancestor of Phaser game object warappers.
*/

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { CoordsTransform } from "../../Shared/Physics/CoordsTransform";

export abstract class PhaserObject
{
  protected abstract phaserObject: PhaserObject.GameObject;

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

  // --------------- Protected methods ------------------

  protected applyConfig(config: PhaserObject.Config)
  {
    if (config.rotation !== undefined)
      this.phaserObject.setRotation(config.rotation);

    if (config.depth !== undefined)
      this.phaserObject.setDepth(config.depth);

    if (config.graphicContainer !== undefined)
      config.graphicContainer.add(this.phaserObject);
  }
}

// ------------------ Type Declarations ----------------------

export namespace PhaserObject
{
  // We need some extra properties that are not in
  // Phaser.GameObjects.GameObject interface but they
  // are in actual phaser game objects like Sprite,
  // Graphics etc.
  export interface GameObject extends Phaser.GameObjects.GameObject
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

  export interface Config
  {
    position?: { x: number; y: number };
    rotation?: number;
    depth?: number;
    graphicContainer?: GraphicContainer;
  }
}