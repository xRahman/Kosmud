import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Graphics } from "../../Client/Phaser/Graphics";
import { FlightScene } from "../../Client/Phaser/FlightScene";

export class GeometryGraphics
{
  private graphics: Graphics;

  constructor(scene: Phaser.Scene, private geometry: PhysicsBody.Geometry)
  {
    this.graphics = new Graphics(scene, FlightScene.Z_ORDER_DEBUG);
    this.graphics.drawGeometry(geometry);
  }

  public getGraphics() { return this.graphics; }
}