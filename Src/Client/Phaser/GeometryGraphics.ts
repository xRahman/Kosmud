import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Graphics } from "../../Client/Phaser/Graphics";
import { FlightScene } from "../../Client/Phaser/FlightScene";

export class GeometryGraphics extends Graphics
{
  constructor(scene: Phaser.Scene, private geometry: PhysicsBody.Geometry)
  {
    super(scene, FlightScene.Z_ORDER_DEBUG);

    this.drawGeometry(geometry);
  }
}