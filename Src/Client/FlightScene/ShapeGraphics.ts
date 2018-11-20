import { Physics } from "../../Shared/Physics/Physics";
import { Container } from "../../Client/Engine/Container";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Graphics } from "../../Client/Engine/Graphics";

export class ShapeGraphics extends Graphics
{
  constructor
  (
    scene: Phaser.Scene,
    shape: Physics.Shape,
    container?: Container
  )
  {
    super(scene, FlightScene.Z_ORDER_DEBUG);

    this.drawShape(shape, 1, Graphics.rgb(0, 255, 255), 0.8);

    if (container !== undefined)
      container.add(this);
  }
}