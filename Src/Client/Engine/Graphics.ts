/*
  Draws lines directly to canvas.
*/

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).

    Actual transformation functions should only be in PhaserObject class
    (see PhaserObject.transformVector() and PhaserObject.transformPolygon()).
*/

import { Vector } from "../../Shared/Physics/Vector";
import { CoordsTransform } from "../../Shared/Physics/CoordsTransform";
import { Physics } from "../../Shared/Physics/Physics";
import { Scene } from "../../Client/Engine/Scene";
import { PhaserObject } from "../../Client/Engine/PhaserObject";

export class Graphics extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Graphics;

  constructor(scene: Scene.PhaserScene, config: Graphics.Config)
  {
    super();

    this.phaserObject = createGraphics(scene, config);

    this.applyConfig(config);
  }

  public static rgb(red: number, green: number, blue: number)
  {
    return Phaser.Display.Color.GetColor(red, green, blue);
  }

  public static rgba(red: number, green: number, blue: number, alpha: number)
  {
    return Phaser.Display.Color.GetColor32(red, green, blue, alpha);
  }

  // ---------------- Public methods --------------------

  public clear()
  {
    this.phaserObject.clear();
  }

  public drawShape
  (
    shape: Physics.Shape,
    lineWidth: number,
    color: number,
    alpha0to1: number
  )
  {
    for (const polygon of shape)
    {
      this.drawPolygon(polygon, lineWidth, color, alpha0to1);
    }
  }

  public drawPolygon
  (
    polygon: Array<{ x: number; y: number }>,
    lineWidth: number,
    color: number,
    alpha0to1: number
  )
  {
    this.phaserObject.lineStyle(lineWidth, color, alpha0to1);

    const tranformedPolygon = CoordsTransform.transformPolygon(polygon);

    this.phaserObject.strokePoints(tranformedPolygon, true);
  }

  public drawVector
  (
    vector: Vector,
    origin: Vector,
    lineWidth: number,
    color: number,
    alpha0to1: number
  )
  {
    this.phaserObject.lineStyle(lineWidth, color, alpha0to1);

    this.phaserObject.beginPath();

    const arrowTip = Vector.v1PlusV2(origin, vector);
    const fletchingLength = Math.min(20, vector.length() / 2);
    const fletchingLeft = Vector.rotate(vector, Math.PI * 5 / 6);
    const fletchingRight = Vector.rotate(vector, -Math.PI * 5 / 6);

    fletchingLeft.setLength(fletchingLength);
    fletchingRight.setLength(fletchingLength);

    this.drawLine(origin, arrowTip);
    this.drawLine(arrowTip, Vector.v1PlusV2(arrowTip, fletchingLeft));
    this.drawLine(arrowTip, Vector.v1PlusV2(arrowTip, fletchingRight));

    this.phaserObject.closePath();
    this.phaserObject.strokePath();
  }

  // ---------------- Private methods -------------------

  /// This only makes sense it it's preceded by 'this.graphics.beginPath();'
  /// and followed by 'this.graphics.closePath(); this.graphics.strokePath();'.
  private drawLine(from: Vector, to: Vector)
  {
    const transformedFrom = CoordsTransform.transformVector(from);
    const transformedTo = CoordsTransform.transformVector(to);

    this.phaserObject.moveTo(transformedFrom.x, transformedFrom.y);
    this.phaserObject.lineTo(transformedTo.x, transformedTo.y);
  }
}

// ----------------- Auxiliary Functions ---------------------

function createGraphics(scene: Scene.PhaserScene, config: Graphics.Config)
{
  const graphicsOptions: GraphicsOptions =
  {
    x: config.position ? config.position.x : 0,
    y: config.position ? config.position.y : 0,
    lineStyle: config.lineStyle,
    fillStyle: config.fillStyle
  };

  return scene.add.graphics(graphicsOptions);
}

// ------------------ Type declarations ----------------------

// Namespace is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export namespace Graphics
{
  export type RGB = { r: number; g: number; b: number };

  export interface Config extends PhaserObject.Config, GraphicsStyles
  {
  }
}