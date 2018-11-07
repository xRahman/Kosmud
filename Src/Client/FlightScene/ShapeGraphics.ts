import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Container } from "../../Client/Phaser/Container";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Graphics } from "../../Client/Phaser/Graphics";

export class ShapeGraphics extends Graphics
{
  constructor
  (
    scene: Phaser.Scene,
    shape: PhysicsBody.Shape,
    container?: Container
  )
  {
    super(scene, FlightScene.Z_ORDER_DEBUG);

    this.drawShape(shape, 1, Graphics.rgb(0, 255, 255), 0.8);

    if (container !== undefined)
      container.add(this);
  }
}