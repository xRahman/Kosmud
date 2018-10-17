
/*
  Draws lines directly to canvas.
*/

// import {Vector} from '../../Shared/Physics/Vector';
import {PhysicsBody} from '../../Shared/Physics/PhysicsBody';
import {Scene} from '../../Client/Phaser/Scene';

export abstract class Graphics
{
  constructor(scene: Scene)
  {
    this.graphics = scene.add.graphics({ x: 0, y: 0 });
  }

  // ----------------- Private data ---------------------

  private graphics: Phaser.GameObjects.Graphics;

  // ---------------- Public methods --------------------

  public clear()
  {
    this.graphics.clear();
  }

  public drawBodyGeometry(geometry: PhysicsBody.Geometry)
  {
    this.graphics.lineStyle(1, 0x00ff00, 0.4);

    // this.graphics.beginPath();

    for (let polygon of geometry)
    {
      this.graphics.strokePoints(polygon, true);
    }

    // this.graphics.closePath();
    // this.graphics.strokePath();
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
