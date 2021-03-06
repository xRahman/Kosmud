/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Vehicle } from "../../Shared/Game/Vehicle";
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

  public update(shipPosition: { x: number; y: number })
  {
    this.vectorsGraphics.setPosition(shipPosition);
  }

  public draw(vehicle: Vehicle)
  {
    this.vectorsGraphics.clear();

    // Order of calling determines order of drawing (the last will be on top).

    // console.log(vehicle.physics.getDesiredVelocity());

    // const desiredRotation = vehicle.physics.desiredRotation.valueOf();

    // this.vectorsGraphics.drawVector
    // (
    //   new Vector({ x: 1, y: 0}).rotate(desiredRotation),
    //   origin, 1, Graphics.rgb(50, 50, 155), 1
    // );

    this.vectorsGraphics.drawCircle
    (
      origin, vehicle.physics.computeBrakingDistance(),
      1, Graphics.rgb(150, 150, 150), 1
    );

    // this.vectorsGraphics.drawCircle
    // (
    //   origin, vehicle.physics.stoppingDistance,
    //   1, Graphics.rgb(80, 80, 80), 1
    // );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getDesiredVelocity(),
      origin, 1, Graphics.rgb(0, 0, 255), 1
    );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getVelocity(),
      origin, 1, Graphics.rgb(106, 90, 255), 1
    );

    // this.vectorsGraphics.drawVector
    // (
    //   vehicle.physics.getDesiredSteeringForce(),
    //   origin, 1, Graphics.rgb(160, 160, 0), 1
    // );

    // this.vectorsGraphics.drawVector
    // (
    //   vehicle.physics.getDesiredForwardSteeringForce(),
    //   origin, 1, Graphics.rgb(110, 110, 0), 1
    // );

    // this.vectorsGraphics.drawVector
    // (
    //   vehicle.physics.getDesiredLeftwardSteeringForce(),
    //   origin, 1, Graphics.rgb(110, 110, 0), 1
    // );

    this.vectorsGraphics.drawVector
    (
      vehicle.physics.getSteeringForce(),
      origin, 1, Graphics.rgb(255, 255, 0), 1
    );
  }
}