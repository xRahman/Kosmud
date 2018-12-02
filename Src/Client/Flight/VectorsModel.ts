import { Scene } from "../../Client/Engine/Scene";
import { Vehicle } from "../../Shared/Physics/Vehicle";
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

  public draw(vehicle: Vehicle)
  {
    this.vectorsGraphics.clear();

    // Order of calling determines order of drawing (the last will be on top).

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getVelocity(),
      origin, 1, Graphics.rgb(255, 0, 255), 1
    );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getDesiredVelocity(),
      origin, 1, Graphics.rgb(0, 0, 255), 1
    );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getDesiredSteeringForce(),
      origin, 1, Graphics.rgb(160, 160, 0), 1
    );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getDesiredForwardSteeringForce(),
      origin, 1, Graphics.rgb(110, 110, 0), 1
    );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getDesiredLeftwardSteeringForce(),
      origin, 1, Graphics.rgb(110, 110, 0), 1
    );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getSteeringForce(),
      origin, 1, Graphics.rgb(255, 255, 0), 1
    );
  }
}