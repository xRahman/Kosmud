import { Scene } from "../../Client/Engine/Scene";
import { Ship } from "../../Client/Game/Ship";
import { Graphics } from "../../Client/Engine/Graphics";
import { Vector } from "../../Shared/Physics/Vector";
import { FlightScene } from "../../Client/Flight/FlightScene";

const origin = new Vector({ x: 0, y: 0 });

export class VectorsModel
{
  private readonly vectorsGraphics: Graphics;

  constructor(scene: Scene)
  {
    this.vectorsGraphics = scene.createGraphics
    (
      { depth: FlightScene.Z_ORDER_DEBUG }
    );
  }

  // ---------------- Public methods --------------------

  public update(shipPosition: Vector)
  {
    this.vectorsGraphics.setPosition(shipPosition);
  }

  public draw(vectors: Ship.Vectors)
  {
    this.vectorsGraphics.clear();

    // Order of calling determines order of drawing (the last will be on top).

    this.vectorsGraphics.drawVector
    (
      vectors.shipVelocity, origin, 1, Graphics.rgb(255, 0, 255), 1
    );

    this.vectorsGraphics.drawVector
    (
      vectors.desiredVelocity, origin, 1, Graphics.rgb(0, 0, 255), 1
    );

    this.vectorsGraphics.drawVector
    (
      vectors.desiredSteeringForce, origin, 1, Graphics.rgb(160, 160, 0), 1
    );

    this.vectorsGraphics.drawVector
    (
      vectors.desiredForwardSteeringForce,
      origin, 1, Graphics.rgb(110, 110, 0), 1
    );

    this.vectorsGraphics.drawVector
    (
      vectors.desiredLeftwardSteeringForce,
      origin, 1, Graphics.rgb(110, 110, 0), 1
    );

    this.vectorsGraphics.drawVector
    (
      vectors.steeringForce, origin, 1, Graphics.rgb(255, 255, 0), 1
    );
  }
}