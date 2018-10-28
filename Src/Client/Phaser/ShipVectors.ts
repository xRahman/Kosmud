import { Ship } from "../../Client/Phaser/Ship";
import { Graphics } from "../../Client/Phaser/Graphics";
import { Vector } from "../../Shared/Physics/Vector";
import { FlightScene } from "../../Client/Phaser/FlightScene";

export class ShipVectors
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

  public getPhaserObject() { return this.graphics.getPhaserObject(); }

  public update()
  {
    this.graphics.setPosition(this.ship.getPosition());

    if (this.needsRedraw)
    {
      this.draw();

      this.needsRedraw = false;
    }
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
      Graphics.rgb(0, 0, 255),
      this.desiredVelocity
    );

    this.graphics.drawVector
    (
      Graphics.rgb(160, 160, 0),
      this.desiredSteeringForce
    );

    this.graphics.drawVector
    (
      Graphics.rgb(255, 255, 0),
      this.steeringForce
    );
  }
}