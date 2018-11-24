import { Scene } from "../../Client/Engine/Scene";
import { Physics } from "../../Shared/Physics/Physics";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Graphics } from "../../Client/Engine/Graphics";

export class ShapeGraphics extends Graphics
{
  constructor
  (
    scene: Scene,
    shape: Physics.Shape,
    graphicContainer?: GraphicContainer
  )
  {
    super(scene, FlightScene.Z_ORDER_DEBUG);

    this.drawShape(shape, 1, Graphics.rgb(0, 255, 255), 0.8);

    if (graphicContainer !== undefined)
      graphicContainer.add(this);
  }
}