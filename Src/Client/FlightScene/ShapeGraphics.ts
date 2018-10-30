import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Graphics } from "../../Client/Phaser/Graphics";
import { FlightScene } from "../../Client/FlightScene/FlightScene";

export class ShapeGraphics extends Graphics
{
  constructor(scene: Phaser.Scene, shape: PhysicsBody.Shape)
  {
    super(scene, FlightScene.Z_ORDER_DEBUG);

    this.drawShape(shape, 1, Graphics.rgb(0, 255, 255), 0.8);
  }
}