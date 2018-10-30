import { Ship } from "../../Client/Game/Ship";
import { SceneUpdate } from "../../Client/Protocol/SceneUpdate";
import { Graphics } from "../../Client/Phaser/Graphics";
import { Vector } from "../../Shared/Physics/Vector";
import { FlightScene } from "../../Client/FlightScene/FlightScene";

export class VectorGraphics
{
  private needsRedraw = false;

  private desiredVelocity = new Vector();
  private steeringForce = new Vector();
  private desiredSteeringForce = new Vector();

  private graphics: Graphics;

  constructor
  (
    private ship: Ship,
    scene: Phaser.Scene
  )
  {
    this.graphics = new Graphics(scene, FlightScene.Z_ORDER_DEBUG);
  }

  // ---------------- Public methods --------------------

  public update()
  {
    this.graphics.setPosition(this.ship.getPosition());

    if (this.needsRedraw)
    {
      this.draw();

      this.needsRedraw = false;
    }
  }

  public updateVectors(update: SceneUpdate)
  {
    this.desiredVelocity = update.desiredVelocity;
    this.steeringForce = update.steeringForce;
    this.desiredSteeringForce = update.desiredSteeringForce;
    this.needsRedraw = true;
  }

  public setDesiredVelocity(desiredVelocity: Vector)
  {
    this.desiredVelocity = desiredVelocity;
    this.needsRedraw = true;
  }

  public setSteeringForce(steeringForce: Vector)
  {
    this.steeringForce = steeringForce;
    this.needsRedraw = true;
  }

  public setDesiredSteeringForce(desiredSteeringForce: Vector)
  {
    this.desiredSteeringForce = desiredSteeringForce;
    this.needsRedraw = true;
  }

  public draw()
  {
    this.graphics.clear();

    // Order of calling determines order of drawing (the last will be on top).

    this.graphics.drawVector
    (
      this.desiredVelocity, new Vector(), 1, Graphics.rgb(0, 0, 255), 1
    );

    this.graphics.drawVector
    (
      this.desiredSteeringForce, new Vector(), 1, Graphics.rgb(160, 160, 0), 1
    );

    this.graphics.drawVector
    (
      this.steeringForce, new Vector(), 1, Graphics.rgb(255, 255, 0), 1
    );
  }
}