import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Vector } from "../../Shared/Physics/Vector";
import { ShipGraphics } from "../../Client/Phaser/ShipGraphics";
import { ShipVectors } from "../../Client/Phaser/ShipVectors";

export class Ship
{
  private graphics: ShipGraphics;
  public vectors: ShipVectors;

  constructor
  (
    private scene: Phaser.Scene,
    private geometry: PhysicsBody.Geometry,
    position: Vector,
    angle: number
  )
  {
    this.graphics = new ShipGraphics(scene, geometry);
    this.vectors = new ShipVectors(this, scene);

    this.setPositionAndAngle(position, angle);
  }

  // ---------------- Public methods --------------------

  public update()
  {
    this.vectors.update();
  }

  public setPositionAndAngle(position: Vector, angle: number)
  {
    this.graphics.setPositionAndAngle(position, angle);
  }

  public getPosition(): Vector
  {
    return this.graphics.getPosition();
  }

  // ---------------- Private methods -------------------
}