/*
  Part of Kosmud

  TEST - a ship.
*/

import * as Shared from "../../Shared/Game/Ship";
import { Tilemap } from "../../Server/Physics/Tilemap";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";

export class Ship extends Shared.Ship
{
  private static readonly tilemap = new Tilemap
  (
    Ship.TILEMAP_NAME,
    Ship.TILEMAP_PATH
  );

  constructor(physicsConfig: PhysicsBody.Config)
  {
    super(physicsConfig);
  }

  // ------------- Public static methods ----------------

  public static async preload()
  {
    // ! Throws exception on error.
    await this.tilemap.load();
  }

  // ! Throws exception on error.
  public static getShape()
  {
    // ! Throws exception on error.
    return this.tilemap.getShape();
  }

  // ---------------- Public methods --------------------

  public startTurningLeft()
  {
    this.setAngularVelocity(-Math.PI / 30);
  }

  public startTurningRight()
  {
    this.setAngularVelocity(Math.PI / 30);
  }

  public stopTurning()
  {
    this.setAngularVelocity(0);
  }

  public moveForward()
  {
    this.setVelocity(20);
  }

  public moveBackward()
  {
    this.setVelocity(-20);
  }

  public stopMoving()
  {
    this.setVelocity(0);
  }
}