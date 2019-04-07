/*  Part of Kosmud  */

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { ZeroTo2Pi } from "../../Shared/Utils/ZeroTo2Pi";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Coords } from "../../Shared/Engine/Coords";

export abstract class PhaserObject
{
  protected abstract phaserObject: PhaserObject.GameObject;

  // ---------------- Public methods --------------------

  public setRotation(rotation: ZeroTo2Pi)
  {
    this.phaserObject.setRotation
    (
      Coords.ServerToClient.angle(rotation.valueOf())
    );
  }

  public getRotation()
  {
    return Coords.ClientToServer.angle(this.phaserObject.rotation);
  }

  public setPosition(position: { x: number; y: number })
  {
    const transformedPosition =
      Coords.ServerToClient.vector(position);

    this.phaserObject.setX(transformedPosition.x);
    this.phaserObject.setY(transformedPosition.y);
  }

  public getPosition()
  {
    return Coords.ClientToServer.vector(this.phaserObject);
  }

  public setPixelPosition({ x, y }: { x: number; y: number })
  {
    this.phaserObject.setX(x);
    this.phaserObject.setY(y);
  }

  public setDepth(depth: number)
  {
    this.phaserObject.setDepth(depth);
  }

  public setScrollFactor(scrollFactor: number)
  {
    this.phaserObject.setScrollFactor(scrollFactor);
  }

  public show()
  {
    this.setVisible(true);
  }

  public hide()
  {
    this.setVisible(false);
  }

  public setVisible(visibility: boolean)
  {
    this.phaserObject.setVisible(visibility);
  }

  public isHidden()
  {
    return !this.phaserObject.visible;
  }

  public isVisible()
  {
    return this.phaserObject.visible;
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
    visible: boolean;
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