
/*
  Draws lines directly to canvas.
*/

/*
  Note:
    This class transforms coordinates from Box2D to Phaser coords
    ('y' axis and angles are inverted).
*/

import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { PhaserObject } from "../../Client/Phaser/PhaserObject";

export class Graphics extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, depth = 0, position = new Vector())
  {
    super(scene);

    this.phaserObject = scene.add.graphics(position);
    this.phaserObject.setDepth(depth);
  }

  // ----------------- Private data ---------------------

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

  public drawGeometry
  (
    geometry: PhysicsBody.Geometry,
    lineWidth: number,
    color: number,
    alpha0to1: number
  )
  {
    for (const polygon of geometry)
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

    // Note:
    //   Points in 'polygon' are transformed from Box2D coords
    //   to Phaser coords before rendering.
    this.phaserObject.strokePoints(transformPologyon(polygon), true);
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
    // Note: Coordinates transform ('y' axis is inverted).
    this.phaserObject.moveTo(from.x, -from.y);
    this.phaserObject.lineTo(to.x, -to.y);
  }
}

// ------------------ Type declarations ----------------------

// Namespace is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export namespace Graphics
{
  export type RGB = { r: number; g: number; b: number };
}

// ----------------- Auxiliary Functions ---------------------

function transformPologyon(polygon: Array<{ x: number; y: number }>)
{
  const result = [];

  for (const point of polygon)
  {
    // Note: Coordinates transform ('y' axis is inverted).
    result.push({ x: point.x, y: -point.y });
  }

  return result;
}