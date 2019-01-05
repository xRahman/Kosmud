/*  Part of Kosmud  */

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

import { Attributes } from "../../Shared/Class/Attributes";
import { Angle } from "../../Shared/Utils/Angle";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { PositiveNumber } from "../../Shared/Utils/PositiveNumber";
import { NonnegativeNumber } from "../../Shared/Utils/NonnegativeNumber";
import { ZeroTo2Pi } from "../../Shared/Utils/ZeroTo2Pi";
import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Engine } from "../../Shared/Engine/Engine";
import { Zone } from "../../Shared/Game/Zone";
import { Vehicle } from "../../Shared/Game/Vehicle";
import { Physics } from "../../Shared/Physics/Physics";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { Serializable } from "../../Shared/Class/Serializable";

export class VehiclePhysics extends Serializable
{
  protected static version = 0;

  // These are constants. They only change if you install a new engine
  // into the vehicle or something like that.
  public readonly MAX_SPEED = new PositiveNumber(3);
  public readonly FORWARD_THRUST = new PositiveNumber(1);
  public readonly BACKWARD_THRUST = new PositiveNumber(0.5);
  public readonly STRAFE_THRUST = new PositiveNumber(0.2);
  public readonly MAX_ANGULAR_VELOCITY = new PositiveNumber(Math.PI / 2);
  public readonly ANGULAR_THRUST = new PositiveNumber(1);

  public readonly DENSITY = new PositiveNumber(1);
  public readonly FRICTION = new ZeroToOne(0.5);
  // 0 - almost no bouncing, 1 - maximum bouncing.
  public readonly RESTITUTION = new ZeroToOne(1);

  // These variables reflect buffs and debuffs that change
  // current thrust, maximum speed or maximum angular velocity.
  public readonly thrustMultiplier = new NonnegativeNumber(1);
  protected static thrustMultiplier: Attributes = { saved: false };

  public readonly speedMultiplier = new NonnegativeNumber(1);
  protected static speedMultiplier: Attributes = { saved: false };

  public readonly angularVelocityMultiplier = new NonnegativeNumber(1);
  protected static angularVelocityMultiplier: Attributes = { saved: false };

  /// TODO: Až budu chtít PhysicsBody savovat, tak musím tohle pořešit.
  ///   Property 'initialPosition' se totiž používá jen při vkládání
  /// do physics worldu - getPosition() potom vytahuje pozici s physicsBody.
  ///   Možná to bude chtít custom savování/loadování, protože při savu
  /// je potřeba nejdřív vytáhnout aktuální pozici z this.body a pak až ji
  /// savnout. A při loadu se pak zas musí body vytvořit.
  public readonly initialPosition = { x: 0, y: 0 };
  public readonly initialRotation = new ZeroTo2Pi(0);

  // These variables are updated in steering forces computation
  // and are sent to the client to be drawn in debug mode.

  public readonly desiredVelocity = new Vector();
  protected static desiredVelocity: Attributes = { saved: false };

  public readonly steeringForce = new Vector();
  protected static steeringForce: Attributes = { saved: false };

  // (This variable is not sent to the client, only torqueRatio is sent).
  public torque = 0;
  protected static torque: Attributes = { saved: false };

  private shapeAsset: ShapeAsset | "Not set" = "Not set";

  private physicsBody: PhysicsBody | "Not in physics world" =
    "Not in physics world";
  protected static physicsBody: Attributes = { saved: false };

  // These variables are updated in steering forces computation and are
  // sent to the client where they are used for displaying ship thrusters.

  private forwardThrustRatio = 0;
  protected static forwardThrustRatio: Attributes = { saved: false };

  private leftwardThrustRatio = 0;
  protected static leftwardThrustRatio: Attributes = { saved: false };

  private torqueRatio = 0;
  protected static torqueRatio: Attributes = { saved: false };

  private readonly waypoint =
  {
    position: new Vector(),
    // Keep direction separately because when we reach the waypoint, target
    // vector will have zero length and thus an undefined direction.
    direction: new ZeroTo2Pi(0)
  };

  private vehicle: Vehicle | "Not set" = "Not set";

  // --------------- Public accessors -------------------

  // ! Throws exception on error.
  public setVehicle(vehicle: Vehicle)
  {
    if (this.vehicle !== "Not set")
    {
      throw Error(`Failed to set reference to ${vehicle.debugId}`
        + ` to it's physics because the physics already has a reference`
        + ` to a vehicle`);
    }

    this.vehicle = vehicle;
  }

  // ! Throws exception on error.
  public getVehicle()
  {
    if (this.vehicle === "Not set")
    {
      throw Error(`Missing reference to a respective vehicle in`
        + ` vehicle physics. Make sure the reference is set in vehicle's`
        + ` onInstantiation() method`);
    }

    return this.vehicle;
  }

  public get currentMaxSpeed()
  {
    return this.MAX_SPEED.valueOf() * this.speedMultiplier.valueOf();
  }

  public get currentForwardThrust()
  {
    return this.FORWARD_THRUST.valueOf() * this.thrustMultiplier.valueOf();
  }

  public get currentBackwardThrust()
  {
    return this.BACKWARD_THRUST.valueOf() * this.thrustMultiplier.valueOf();
  }

  public get currentStrafeThrust()
  {
    return this.STRAFE_THRUST.valueOf() * this.thrustMultiplier.valueOf();
  }

  public get currentMaxAngularVelocity()
  {
    return this.MAX_ANGULAR_VELOCITY.valueOf()
      * this.angularVelocityMultiplier.valueOf();
  }

  public get currentAngularThrust()
  {
    return this.ANGULAR_THRUST.valueOf() * this.thrustMultiplier.valueOf();
  }

  // ! Throws exception on error.
  public get inertiaValue()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getInertia().valueOf();
  }

  // ! Throws exception on error.
  public get massValue()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getMass().valueOf();
  }

  // ! Throws exception on error.
  public setShapeAsset(asset: ShapeAsset)
  {
    this.getVehicle().addAsset(asset);

    if (this.shapeAsset !== "Not set")
      // ! Throws exception on error.
      this.getVehicle().removeAsset(this.shapeAsset);

    // ! Throws exception on error.
    this.shapeAsset = this.getVehicle().addAsset(asset);
  }

  // ! Throws exception on error.
  public getShapeAsset()
  {
    if (this.shapeAsset === "Not set")
    {
      throw new Error(`${this.getVehicle().debugId} doesn't have shape asset`);
    }

    return this.shapeAsset;
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public getPosition() { return this.getPhysicsBody().getPosition(); }

  // ! Throws exception on error.
  public setPosition(position: { x: number; y: number })
  {
    // ! Throws exception on error.
    this.getPhysicsBody().setPosition(position);
  }

  // ! Throws exception on error.
  public getX() { return this.getPhysicsBody().getX(); }
  // ! Throws exception on error.
  public getY() { return this.getPhysicsBody().getY(); }
  // ! Throws exception on error.
  public getRotation() { return this.getPhysicsBody().getRotation(); }

  public getDesiredVelocity() { return this.desiredVelocity; }
  public getSteeringForce() { return this.steeringForce; }

  // ! Throws exception on error.
  public getVelocity() { return this.getPhysicsBody().getVelocity(); }

  // ! Throws exception on error.
  public setVelocity(velocity: Vector)
  {
    // ! Throws exception on error.
    this.getPhysicsBody().setVelocity(velocity);
  }

  // ! Throws exception on error.
  public getAngularVelocity()
  {
    return this.getPhysicsBody().getAngularVelocity();
  }

  public getForwardThrustRatio() { return this.forwardThrustRatio; }

  public getLeftwardThrustRatio() { return this.leftwardThrustRatio; }

  public getTorqueRatio() { return this.torqueRatio; }

  public getWaypointPosition()
  {
    return this.waypoint.position;
  }

  public getWaypointDirection()
  {
    return this.waypoint.direction.valueOf();
  }

  // ! Throws exception on error.
  public updateWaypointDirection()
  {
    // ! Throws exception on error.
    const shipPosition = this.getPosition();
    const waypointPosition = this.getWaypointPosition();

    if (!shipPosition.equals(waypointPosition))
    {
      const targetVector = Vector.v1MinusV2
      (
        waypointPosition, shipPosition
      );

      this.waypoint.direction.set(targetVector.getRotation());
    }
  }

  // ! Throws exception on error.
  public setWaypoint(position: { x: number; y: number })
  {
    this.waypoint.position.set(position);
    // ! Throws exception on error.
    this.updateWaypointDirection();
  }

  // ! Throws exception on error.
  public getShape()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getShape();
  }

  // ! Throws exception on error.
  public addToPhysicsWorld(physicsWorld: PhysicsWorld, zone: Zone)
  {
    // ! Throws exception on error.
    const physicsShape = zone.getPhysicsShape(this.getShapeAsset());

    this.physicsBody = physicsWorld.createPhysicsBody
    (
      this.getVehicle(), this, physicsShape
    );

    /// Nothing needs to be initialized for now. I'll leave it here
    /// for possible future use.
    // // ! Throws exception on error.
    // this.init();

    // ! Throws exception on error.
    // Set waypoint to the new position so the vehicle doesn't
    // go back to where it was.
    this.setWaypoint(this.getPhysicsBody().getPosition());
  }

  // ! Throws exception on error.
  public steer()
  {
    // ! Throws exception on error.
    this.arrive();

    // this.seek();

    // ! Throws exception on error.
    this.getPhysicsBody().applyForce(this.steeringForce);

    // ! Throws exception on error.
    this.getPhysicsBody().applyTorque(this.torque);
  }

  // ! Throws exception on error.
  // This is only used on the client in debug drawing mode.
  public computeBrakingDistance()
  {
    // ! Throws exception on error.
    const targetVector = this.computeTargetVector();

    const fullBrakingThrust = this.computeBrakingThrust(targetVector);

    return computeBrakingDistance
    (
      this.massValue,
      this.currentMaxSpeed,
      // ! Throws exception on error.
      fullBrakingThrust
    );
  }

  // --------------- Protected methods ------------------

  // // ! Throws exception on error.
// protected seek()
// {
//   // ! Throws exception on error.
//   const currentVelocity = this.getVelocity();
//   // ! Throws exception on error.
//   // Rotation in Box2D can be negative or even greater than 2π.
//   // We need to fix that so we can correcly subtract angles.
//   const currentRotation = Angle.normalize(this.getRotation());
//   // ! Throws exception on error.
//   const currentPosition = this.getPosition();
//   const desiredPosition = this.waypoint;

//   // 1. 'desired velocity' = 'desired position' - 'current position'.
//   const desiredVelocity = Vector.v1MinusV2
//   (
//     desiredPosition, currentPosition
//   );

//   // 2. Scale 'desired velocity' to maximum speed.
//   desiredVelocity.setLength(this.MAX_SPEED);

//   const desiredSteeringForce = Vector.v1MinusV2
//   (
//     desiredVelocity,
//     currentVelocity
//   );

//   this.computeLinearForces
//   (
//     desiredSteeringForce,
//     desiredVelocity,
//     currentVelocity,
//     currentRotation
//   );
//   const desiredRotation = desiredVelocity.getRotation();

//   const angularDistance = this.desiredRotation - currentRotation;
//   /// TODO (zatím natvrdo):
//   const angularPhase = "Accelerating";

//   this.computeAngularForces
//   (
//     currentRotation,
//     desiredRotation,
//     angularDistance,
//     angularPhase
//   );
// }

  // ! Throws exception on error.
  protected arrive()
  {
    this.torque = this.computeArriveTorque();

    this.steeringForce.set(this.computeArriveSteeringForce());
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private getPhysicsBody()
  {
    if (this.physicsBody === "Not in physics world")
    {
      throw Error(`${this.getVehicle().debugId} is not in`
        + ` physics world yet and doesn't have a physics body`);
    }

    return this.physicsBody;
  }

  // --- Init ---

  /// Nothing needs to be initialized for now. I'll leave it here
  /// for possible future use.
  // ! Throws exception on error.
  // private init()
  // {
  // }

  // --- Arrive Torque ---

  private computeArriveTorque()
  {
    // ! Throws exception on error.
    const currentAngularVelocity = this.getAngularVelocity();

    // ! Throws exception on error.
    // (There is a hard angular velocity limit in Box2d.)
    this.validateAngularVelocity(currentAngularVelocity);

    // ! Throws exception on error.
    const inertia = this.inertiaValue;
    // ! Throws exception on error.
    const angularVelocityChange =
      this.computeAngularVelocityChange(inertia, currentAngularVelocity);

    const torque = this.computeTorqueToChangeAngularVelocity
    (
      angularVelocityChange, inertia
    );

    this.updateTorqueRatio(torque);

    return torque;
  }

  // ! Throws exception on error.
  private computeAngularVelocityChange
  (
    inertia: number,
    currentAngularVelocity: number
  )
  {
    // ! Throws exception on error.
    const angularDistance = this.computeAngularDistance();

    const desiredAngularVelocity =
      // ! Throws exception on error.
      this.computeDesiredAngularVelocity(angularDistance, inertia);

    return desiredAngularVelocity - currentAngularVelocity;
  }

  // ! Throws exception on error.
  private computeAngularDistance()
  {
    // ! Throws exception on error.
    const desiredRotation = this.getWaypointDirection();
    // ! Throws exception on error.
    const currentRotation = this.getRotation().valueOf();

    return Angle.minusPiToPi(desiredRotation - currentRotation);
  }

  // ! Throws exception on error.
  private computeDesiredAngularVelocity
  (
    angularDistance: number,
    inertia: number
  )
  {
    // Distance travelled by angular velocity achieved by one tick
    // of acceleration at full angular thrust (which is the same as
    // distance travelled in the last tick of decceleration).
    //   d = F / (m * FPS * FPS * 2);
    const lastTickDistance =
      this.currentAngularThrust / (inertia * Engine.FPS * Engine.FPS * 2);

    // Prevent slow stopping by a lot of small iterations when we are
    // almost at the target.
    if (Math.abs(angularDistance) < lastTickDistance)
      return 0;

    let desiredAngularSpeed = Math.sqrt
    (
      // We can't square root a negative number so we need to do it
      // on absolute value and reapply the direction later.
      Math.abs(angularDistance * this.currentAngularThrust * 2 / inertia)
    );

    // In the previous step we have calculated angular velocity that we
    // would have to have at current position in order to stop exactly
    // at the target. But we are already at that point so we have to
    // subtract the change in angular velocity that will be added in
    // the next tick.
    desiredAngularSpeed -= this.currentAngularThrust / (inertia * Engine.FPS);

    desiredAngularSpeed =
      desiredAngularSpeed.atMost(this.currentMaxAngularVelocity);

    const desiredAngularVelocity = (angularDistance < 0) ?
      -desiredAngularSpeed : desiredAngularSpeed;

    // ! Throws exception on error.
    // (There is a hard angular velocity limit in Box2d.)
    return this.validateAngularVelocity(desiredAngularVelocity);
  }

  private computeTorqueToChangeAngularVelocity
  (
    angularVelocityChange: number,
    inertia: number
  )
  {
    // Compute angular thrust needed to reach desired angular velocity in
    // one tick (this handles the last tick when we need less than full
    // thrust to come to stop. In other cases we cap it to maximum thrust).
    const desiredAngularThrust = inertia * angularVelocityChange * Engine.FPS;

    return Number(desiredAngularThrust).clampTo
    (
      -this.currentAngularThrust,
      this.currentAngularThrust
    );
  }

  private updateTorqueRatio(torque: number)
  {
    const ratio = (this.currentAngularThrust !== 0) ?
      torque / this.currentAngularThrust : 0;

    this.torqueRatio = ratio * this.thrustMultiplier.valueOf();
  }

  // --- Arrive Steering Force ---

  // ! Throws exception on error.
  private computeArriveSteeringForce()
  {
    // ! Throws exception on error.
    const currentVelocity = this.getVelocity();
    const currentSpeed = currentVelocity.length();

    // ! Throws exception on error.
    // (There is a hard speed limit in Box2d.)
    this.validateSpeed(currentSpeed);

    // ! Throws exception on error.
    const targetVector = this.computeTargetVector();
    const distance = targetVector.length();

    if (distance > 0)
      // ! Throws exception on error.
      this.updateWaypointDirection();

    // ! Throws exception on error.
    const desiredSpeed = this.computeDesiredSpeed(distance, targetVector);

    this.desiredVelocity.set(targetVector).setLength(desiredSpeed);

    const velocityChange = this.computeVelocityChange(currentVelocity);

    // ! Throws exception on error.
    const thrust = this.computeSteeringThrust(velocityChange);

    return new Vector(velocityChange).setLength(thrust);
  }

  private computeVelocityChange(currentVelocity: Vector)
  {
    return Vector.v1MinusV2(this.desiredVelocity, currentVelocity);
  }

  // ! Throws exception on error.
  private computeSteeringThrust(velocityChange: Vector)
  {
    const thrustData = this.computeThrustData(velocityChange);
    const thrust = this.computeThrustValue
    (
      velocityChange, thrustData.fullThrust
    );

    this.updateThrustRatios(thrustData, thrust);

    return thrust;
  }

  // ! Throws exception on error.
  private computeThrustValue(velocityChange: Vector, fullThrust: number)
  {
    // ! Throws exception on error.
    const mass = this.massValue;
    const desiredSpeedChange = velocityChange.length();

    // Compute thrust needed to reach desired speed in one tick
    // (this handles the last tick when we need less than full
    //  thrust to come to stop. In other cases we cap it to full thrust).
    const desiredThrust = mass * desiredSpeedChange * Engine.FPS;

    return desiredThrust.atMost(fullThrust);
  }

  private computeThrustData(direction: Vector): ThrustData
  {
    const thrustAngle = this.angleToShip(direction);

    // Surprisingly, ratios of coordinates of a point on
    // an ellipse to respective radii of that ellipse
    // are calculated exactly the same way as on the circle
    // (it's because radia cancel themselves from the equations).
    const forwardThrustRatio = Math.cos(thrustAngle);
    const leftwardThrustRatio = Math.sin(thrustAngle);
    const fullThrust = this.computeThrustFromRatios
    (
      forwardThrustRatio,
      leftwardThrustRatio
    );

    return { forwardThrustRatio, leftwardThrustRatio, fullThrust };
  }

  private computeThrustFromRatios
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number
  )
  {
    // The idea here is to compute thrust as a distance of a point on
    // ellipse with x radius equal to forward or backward maximum thrust
    // and y radius equal to strafe maximum thrust.
    //   However, forward maximum thrust differs from backward maximum
    // thrust so it's not a single ellipse but half-an-ellipse in
    // forward direction and another half-an-ellipse in backward
    // direction.
    //   (Also note that computing thrust as a point on ellipse technically
    // isn't correct, forces should actually just add up as vectors, but
    // I don't want ships to accelerate the fastest when going askew).

    if (forwardThrustRatio > 0)
    {
      return distanceFromOrigin
      (
        forwardThrustRatio * this.currentForwardThrust,
        leftwardThrustRatio * this.currentStrafeThrust
      );
    }
    else
    {
      return distanceFromOrigin
      (
        forwardThrustRatio * this.currentBackwardThrust,
        leftwardThrustRatio * this.currentStrafeThrust
      );
    }
  }

  private updateThrustRatios(thrustData: ThrustData, thrust: number)
  {
    let ratio = (thrustData.fullThrust !== 0) ?
      thrust / thrustData.fullThrust : 0;

    // Note that this will make thrusters even longer than 100% if
    // 'this.thrustMultiplier' is > 1. Exhaust sound volume will stay
    // at 100%, however, because sound volume can't go higher.
    ratio *= this.thrustMultiplier.valueOf();

    this.forwardThrustRatio = thrustData.forwardThrustRatio * ratio;
    this.leftwardThrustRatio = thrustData.leftwardThrustRatio * ratio;
  }

  // ! Throws exception on error.
  private computeTargetVector()
  {
    return Vector.v1MinusV2
    (
      this.getWaypointPosition(),
      // ! Throws exception on error.
      this.getPosition()
    );
  }

  private computeBrakingThrust(targetVector: Vector)
  {
    const thrustData = this.computeThrustData(Vector.negate(targetVector));

    return this.computeThrustFromRatios
    (
      thrustData.forwardThrustRatio,
      thrustData.leftwardThrustRatio
    );
  }

  private angleToShip(direction: Vector)
  {
    const shipRotation = this.getRotation().valueOf();
    const directionRotation = direction.getRotation();

    return Angle.zeroTo2Pi(directionRotation - shipRotation);
  }

  // ! Throws exception on error.
  private computeDesiredSpeed(distance: number, targetVector: Vector): number
  {
    const fullBrakingThrust = this.computeBrakingThrust(targetVector);

    // Distance travelled by velocity achieved by one tick of
    // acceleration at fullBrakingThrust (which is the same as
    // distance travelled in the last tick of decceleration).
    //   d = F / (m * FPS * FPS * 2);
    const lastTickDistance =
      fullBrakingThrust / (this.massValue * Engine.FPS * Engine.FPS * 2);

    // Prevent slow stopping by a lot of small iterations when we are
    // almost at the target.
    if (distance < lastTickDistance)
      return 0;

    let desiredSpeed = Math.sqrt
    (
      distance * fullBrakingThrust * 2 / this.massValue
    );

    // In the previous step we have calculated velocity that we would
    // have to have at current position in order to stop exactly at
    // the target. But we are already at that point so we have to subtract
    // the change in velocity that will be added in the next tick.
    desiredSpeed -= fullBrakingThrust / (this.massValue * Engine.FPS);

    desiredSpeed = desiredSpeed.atMost(this.currentMaxSpeed);

    // ! Throws exception on error.
    // (There is a hard speed limit in Box2d.)
    return this.validateSpeed(desiredSpeed);
  }

  // ! Throws exception on error.
  private validateSpeed(speed: number)
  {
    if (speed > Physics.MAXIMUM_POSSIBLE_SPEED)
    {
      throw Error(`Vehicle ${this.getVehicle().debugId} attempts to reach`
        + ` speed '${speed}' which is greater than maximum speed allowed`
        + ` by Box2d physics engine (${Physics.MAXIMUM_POSSIBLE_SPEED}).`
        + ` There are three ways to handle this: 1 - set lower maximum`
        + ` speed for this vehicle, 2 - change coords transformation ratio in`
        + ` CoordsTransform so the same speed in pixels translates to lower`
        + ` speed in physics engine, 3 - increase engine FPS (that effectively`
        + ` increases maximum possible speed)`);
    }

    return speed;
  }

  // ! Throws exception on error.
  private validateAngularVelocity(angularVelocity: number)
  {
    if (angularVelocity > Physics.MAXIMUM_POSSIBLE_ANGULAR_VELOCITY)
    {
      throw Error(`Vehicle ${this.getVehicle().debugId} attempts to reach`
        + ` angular velocity '${angularVelocity}' which is greater than`
        + ` maximum angular velocity allowed by Box2d physics engine`
        + ` (${Physics.MAXIMUM_POSSIBLE_ANGULAR_VELOCITY}). There are`
        + ` two ways to handle this: 1 -  Make sure that maximum angular`
        + ` velocity for this vehicle doesn't exceed this limit, 2 - increase`
        + ` engine FPS (that effectively increases maximum possible angular`
        + ` velocity)`);
    }

    return angularVelocity;
  }
}

// ----------------- Auxiliary Functions ---------------------

function computeBrakingDistance(m: number, v: number, F: number)
{
  if (F === 0)
    return 0;

  return (m * v * v) / (F * 2);
}

function distanceFromOrigin(x: number, y: number)
{
  return Math.sqrt(x * x + y * y);
}

// ------------------ Type declarations ----------------------

type ThrustData =
{
  forwardThrustRatio: number;
  leftwardThrustRatio: number;
  fullThrust: number;
};