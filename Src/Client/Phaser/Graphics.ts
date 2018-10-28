
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

export class Graphics
{
  constructor(scene: Phaser.Scene, depth = 0)
  {
    this.graphics = scene.add.graphics({ x: 0, y: 0 });
    this.graphics.setDepth(depth);
  }

  // ----------------- Private data ---------------------

  private graphics: Phaser.GameObjects.Graphics;

  public static rgb(red: number, green: number, blue: number)
  {
    return Phaser.Display.Color.GetColor(red, green, blue);
  }

  public static rgba(red: number, green: number, blue: number, alpha: number)
  {
    return Phaser.Display.Color.GetColor32(red, green, blue, alpha);
  }

  // ---------------- Public methods --------------------

  public addToContainer(container: Phaser.GameObjects.Container)
  {
    container.add(this.graphics);
  }

  public clear()
  {
    this.graphics.clear();
  }

  public drawGeometry(geometry: PhysicsBody.Geometry)
  {
    this.graphics.lineStyle(1, 0x00FFFF, 0.8);

    for (const polygon of geometry)
      this.drawPolygon(polygon);
  }

  public drawPolygon(polygon: Array<{ x: number; y: number }>)
  {
    // Note:
    //   Points in 'polygon' are transformed from Box2D coords
    //   to Phaser coords before rendering.
    this.graphics.strokePoints(transformPologyon(polygon), true);
  }

  public drawVector
  (
    color: number,
    vector: Vector,
    origin: Vector = new Vector()
  )
  {
    const LINE_WIDTH = 1;

    this.graphics.lineStyle(LINE_WIDTH, color);

    this.graphics.beginPath();

    const arrowTip = Vector.v1PlusV2(origin, vector);
    const fletchingLength = Math.min(20, vector.length() / 2);
    const fletchingLeft = Vector.rotate(vector, Math.PI * 5 / 6);
    const fletchingRight = Vector.rotate(vector, -Math.PI * 5 / 6);

    fletchingLeft.setLength(fletchingLength);
    fletchingRight.setLength(fletchingLength);

    this.drawLine(origin, arrowTip);
    this.drawLine(arrowTip, Vector.v1PlusV2(arrowTip, fletchingLeft));
    this.drawLine(arrowTip, Vector.v1PlusV2(arrowTip, fletchingRight));

    this.graphics.closePath();
    this.graphics.strokePath();
  }

  public setPosition(position: Vector)
  {
    // Note: Coordinates transform ('y' axis is inverted).
    this.graphics.x = position.x;
    this.graphics.y = -position.y;
  }

  // ---------------- Private methods -------------------

  /// This only makes sense it it's preceded by 'this.graphics.beginPath();'
  /// and followed by 'this.graphics.closePath();' and
  /// 'this.graphics.strokePath();'.
  private drawLine(from: Vector, to: Vector)
  {
    // Note: Coordinates transform ('y' axis is inverted).
    this.graphics.moveTo(from.x, -from.y);
    this.graphics.lineTo(to.x, -to.y);
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