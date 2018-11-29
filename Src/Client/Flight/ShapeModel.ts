import { Scene } from "../../Client/Engine/Scene";
import { Physics } from "../../Shared/Physics/Physics";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { Graphics } from "../../Client/Engine/Graphics";

export class ShapeModel
{
  private readonly shapeGraphics: Graphics;

  constructor
  (
    scene: Scene,
    shape: Physics.Shape,
    graphicContainer?: GraphicContainer
  )
  {
    this.shapeGraphics = new Graphics
    (
      scene,
      {
        depth: FlightScene.Z_ORDER_DEBUG,
        graphicContainer
      }
    );

    this.shapeGraphics.drawShape(shape, 1, Graphics.rgb(0, 255, 255), 0.8);
  }
}