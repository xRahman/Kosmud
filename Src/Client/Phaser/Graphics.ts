
/*
  Draws lines directly to canvas.
*/

// import {Vector} from '../../Shared/Physics/Vector';
import {PhysicsBody} from '../../Shared/Physics/PhysicsBody';

export class Graphics
{
  constructor(scene: Phaser.Scene, depth = 0)
  {
    this.graphics = scene.add.graphics({ x: 0, y: 0 });
    this.graphics.setDepth(depth);
  }

  // ----------------- Private data ---------------------

  private graphics: Phaser.GameObjects.Graphics;

  // --------------- Public accessors -------------------

  public getPhaserObject() { return this.graphics; }

  // ---------------- Public methods --------------------

  public clear()
  {
    this.graphics.clear();
  }

  public drawBodyGeometry(geometry: PhysicsBody.Geometry)
  {
    this.graphics.lineStyle(1, 0x00ff00, 0.4);

    for (let polygon of geometry)
    {
      this.graphics.strokePoints(polygon, true);
    }
  }

  // ---------------- Private methods -------------------

  /// This only makes sense it it's preceded by 'this.graphics.beginPath();'
  /// and followed by 'this.graphics.closePath();' and
  /// 'this.graphics.strokePath();'.
  // private drawLine (from: Vector, to: Vector)
  // {
  //   this.graphics.moveTo(from.x, from.y);
  //   this.graphics.lineTo(to.x, to.y);
  // }
}

// ----------------- Auxiliary Functions ---------------------
