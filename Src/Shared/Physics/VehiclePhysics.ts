/*
  Part of Kosmud

  Vehicle physics properties and behaviour.
*/

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

type ThrustData =
{
  forwardThrustRatio: number;
  leftwardThrustRatio: number;
  fullThrust: number;
};

import { Syslog } from "../../Shared/Log/Syslog";
import { Angle } from "../../Shared/Utils/Angle";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
// import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { PositiveNumber } from "../../Shared/Utils/PositiveNumber";
import { NonnegativeNumber } from "../../Shared/Utils/NonnegativeNumber";
// import { MinusPiToPi } from "../../Shared/Utils/MinusPiToPi";
import { ZeroToPi } from "../../Shared/Utils/ZeroToPi";
import { ZeroTo2Pi } from "../../Shared/Utils/ZeroTo2Pi";
import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Engine } from "../../Shared/Engine/Engine";
import { Zone } from "../../Shared/Game/Zone";
import { Entity } from "../../Shared/Class/Entity";
import { Physics } from "../../Shared/Physics/Physics";
// import { Coords } from "../../Shared/Engine/Coords";
import { Serializable } from "../../Shared/Class/Serializable";

export class VehiclePhysics extends Serializable
{
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
  public readonly speedMultiplier = new NonnegativeNumber(1);
  public readonly angularVelocityMultiplier = new NonnegativeNumber(1);

  /// TODO: Až budu chtít PhysicsBody savovat, tak musím tohle pořešit.
  ///   Property 'initialPosition' se totiž používá jen při vkládání
  /// do physics worldu - getPosition() potom vytahuje pozici s physicsBody.
  ///   Možná to bude chtít custom savování/loadování, protože při savu
  /// je potřeba nejdřív vytáhnout aktuální pozici z this.body a pak až ji
  /// savnout. A při loadu se pak zas musí body vytvořit.
  public readonly initialPosition = { x: 0, y: 0 };
  public readonly initialRotation = new ZeroTo2Pi(0);

// Tohle se updatuje při výpočtu arriveTorque
// (ale nikam se to neposílá - posílá se imho jen torque ratio).
  public torque = 0;
// Desired rotation se posílá a zobrazuje (to je ten tmavě modrej vektor
// k waypointu - momentálně dost krátkej, po změně měřítka).
  public desiredRotation = new ZeroTo2Pi(0);

// Tohle se updatuje při výpočtu arriveLinearForce a posílá se to
// na klient kvůli debug grafice.
  public brakingDistance = 0;
  public readonly desiredVelocity = new Vector();
  public readonly steeringForce = new Vector();

  public shapeId = "<missing physics shape id>";

  /// TODO: Tohle by se nemělo savovat (až budu řešit savování).
  private physicsBody: PhysicsBody | "Not in physics world" =
    "Not in physics world";

  // Tohle se posílá na klient a zobrazují se podle toho thrustery.
  private forwardThrustRatio = 0;
  private leftwardThrustRatio = 0;
  private torqueRatio = 0;

  private readonly waypoint =
  {
    position: new Vector(),
    // Keep direction separately because when we reach the waypoint, target
    // vector will have zero length and thus an undefined direction.
    direction: new ZeroTo2Pi(0)
  };

  // Tohle se používá při výpočtu agular steeringu.
  private readonly brakingAngle = new ZeroToPi(0);
  private readonly maxBrakingAngle = new ZeroToPi(0);
  private readonly angularVelocityIncrement = new NonnegativeNumber(0);

  constructor(private readonly entity: Entity)
  {
    super();
  }

  // --------------- Public accessors -------------------

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

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public getPosition() { return this.getPhysicsBody().getPosition(); }

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

  public updateWaypointDirection()
  {
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

  public setWaypoint(position: { x: number; y: number })
  {
    this.waypoint.position.set(position);
    this.updateWaypointDirection();
    this.updateBrakingAngle();
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
    const physicsShape = zone.getPhysicsShape(this.shapeId);

    this.physicsBody = physicsWorld.createPhysicsBody
    (
      this.entity, this, physicsShape
    );

    // ! Throws exception on error.
    this.init();

    // ! Throws exception on error.
    // Set waypoint to the new position so the vehicle doesn't
    // go back to where it was.
    this.setWaypoint(this.getPhysicsBody().getPosition());
  }

  // ! Throws exception on error.
  public steer()
  {
    this.arrive();

    // this.seek();

    // ! Throws exception on error.
    this.getPhysicsBody().applyForce(this.steeringForce);

    // ! Throws exception on error.
    this.getPhysicsBody().applyTorque(this.torque);
  }

  // --------------- Protected methods ------------------

// +
  // ! Throws exception on error.
  protected arrive()
  {
    this.torque = this.computeArriveTorque();

    this.steeringForce.set(this.computeArriveSteeringForce());
  }

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

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private getPhysicsBody()
  {
    if (this.physicsBody === "Not in physics world")
    {
      throw new Error(`${this.entity.debugId} is not in physics world`
        + ` yet and doesn't have a physics body`);
    }

    return this.physicsBody;
  }

  // --- Init ---

  // +
  // ! Throws exception on error.
  private init()
  {
    // ! Throws exception on error.
    this.updateAngularVelocityInrement();
    // ! Throws exception on error.
    this.updateMaxBrakingAngle();
  }

  // +
  // ! Throws exception on error.
  private updateAngularVelocityInrement()
  {
    // ! Throws exception on error.
    const acceleration = this.currentAngularThrust / this.inertiaValue;

    this.angularVelocityIncrement.set(acceleration / Engine.FPS);
  }

  // +
  // ! Throws exception on error.
  private updateMaxBrakingAngle()
  {
    const maxBrakingAngle = computeBrakingDistance
    (
      // ! Throws exception on error.
      this.inertiaValue,
      this.currentMaxAngularVelocity,
      this.currentAngularThrust
    );

    this.maxBrakingAngle.set(maxBrakingAngle);
  }

  // --- Arrive Torque ---

// +
  private computeArriveTorque()
  {
    const distance = this.computeAngularDistance();

    // If the player changes desired angle while we were still turning
    // to it, we might overtake it because we can't deccelerate fast enough.
    if (this.isOvertakingDesiredAngle(distance))
    {
      // If we are overtaking desired angle, we need to recalculate braking
      // angle to know when to start deccelerating on our way back.
      this.updateBrakingAngle();
    }

    // Note that reversing after overtaking the desired angle is also
    // computed as acceleration (just in the opposite direction).
    //   It's a "Deccelerate" action only when we want to slow down to
    // stop.
    const action = this.determineAngularAction(distance);

    let torque: number;

    switch (action)
    {
      case "Accelerate":
        torque = this.computeAccelerationTorque(distance);
        break;

      case "Deccelerate":
        torque = this.computeDeccelerationTorque(distance);
        break;

      default:
        throw Syslog.reportMissingCase(action);
    }

    this.updateTorqueRatio(torque);

    return torque;
  }

// +
  private updateTorqueRatio(torque: number)
  {
    this.torqueRatio = torque / this.ANGULAR_THRUST.valueOf();
  }

// +
  private determineAngularAction(distance: number)
  : "Accelerate" | "Deccelerate"
  {
    const angleIncrement = this.computeAngleIncrement();
    const brakingAngle = this.brakingAngle.valueOf();

    // We compare the angle where we would be the next tick with
    // braking angle (which is the smallest angle when we need to start
    // deccelerating in order to stop at desired angle) instead of our
    // current angle because physics is simulated in discrete steps
    // and if we started deccelerating after we exceeded the braking angle,
    // we wouldn't be able to stop in time.
    if (Math.abs(distance - angleIncrement) > brakingAngle)
    {
      return "Accelerate";
    }
    else
    {
      return "Deccelerate";
    }
  }

// +
  private computeAccelerationTorque(distance: number): number
  {
    // ! Throws exception on error.
    const currentVelocity = this.getPhysicsBody().getAngularVelocity();

    // const maxVelocity = this.currentMaxAngularVelocityValue;
    // const desiredVelocity = (distance > 0) ? maxVelocity : -maxVelocity;
    const desiredVelocity = this.computeDesiredAngularVelocity
    (
      distance, currentVelocity
    );

    const desiredVelocityChange = desiredVelocity - currentVelocity;

    // Note: 'this.angularVelocityIncrement' is a precomputed value
    // (it only changes when inertia or maximum torque changes).
    const velocityIncrement = this.angularVelocityIncrement.valueOf();

    if (Math.abs(desiredVelocityChange) < velocityIncrement)
      // When we are almost at desired angular velocity we compute
      // exact torque needed to reach it.
      // ! Throws exception on error.
      return this.inertiaValue * desiredVelocityChange;

    const fullThrust = this.currentAngularThrust;

    // If we won't reach desired angular velocity in this tick we apply
    // maximum possible torque in respective direction.
    return (desiredVelocity > 0) ? fullThrust : -fullThrust;
  }

// +
  private computeDesiredAngularVelocity
  (
    distance: number,
    currentVelocity: number
  )
  {
    const maxVelocity = this.currentMaxAngularVelocity;
    const brakingAngle = this.maxBrakingAngle.valueOf();

    // When the ship is rotating to the right and the player
    // click behind the ship slightly to the left, without this
    // condition the ship would stop to turn the other (shorter)
    // direction - but that would actually take longer because
    // the need to stop and accelerate again.
    //   Following conditions prevent that and allow to continue
    // turning in the same direction to reach desired angle faster.
    // (It also feels like more natural ship handling).
    if (currentVelocity > 0 && (distance < -Angle.PI + brakingAngle))
      return maxVelocity;

    if (currentVelocity < 0 && (distance > Angle.PI - brakingAngle))
      return -maxVelocity;

    return (distance > 0) ? maxVelocity : -maxVelocity;
  }

// +
  // ! Throws exception on error.
  private computeDeccelerationTorque(distance: number): number
  {
    const v = this.getAngularVelocity();

    // Prevent division by zero.
    if (distance === 0)
      return 0;

    // The idea here is to compute torque needed to stop exactly
    // at desired angle.
    //   Braking distance is calculated this way:
    //     d = (1/2 * mass * v * v) / Force;
    //   Therefore:
    //     Force = (mass * v * v) / (2 * d)
    // ! Throws exception on error.
    const desiredTorque = -(this.inertiaValue * v * v) / (2 * distance);
    const fullThrust = this.currentAngularThrust;

    // Ensure that we don't exceed our maximum torque. This can happen
    // when something pushes us or when player sets reversed direction.
    // In that case we will overshoot our desired rotation because we
    // simply can't deccelerate fast enough.
    return Number(desiredTorque).clampTo(-fullThrust, fullThrust);
  }

  // +
  private computeAngularDistance()
  {
    // const desiredPosition = this.getWaypointPosition();
    // const currentPosition = this.getPosition();

    // const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);

    // const desiredRotation = computeDesiredRotation(targetVector);
    const desiredRotation = this.getWaypointDirection();
    const currentRotation = this.getRotation().valueOf();

    // Remember desired rotation so we can send it later to the client
    // to be drawn in debug mode.
    this.desiredRotation.set(desiredRotation);

    // ! Throws exception on error.
    return Angle.minusPiToPi(desiredRotation - currentRotation);
  }

// +
  // ! Throws exception on error.
  private computeAngleIncrement()
  {
    // a = F / m
    // ! Throws exception on error.
    const acceleration = this.torque / this.inertiaValue;
    const velocityIncrement = acceleration / Engine.FPS;
    const nextTickVelocity = this.getAngularVelocity() + velocityIncrement;

    return nextTickVelocity / Engine.FPS;
  }

// +
  private isOvertakingDesiredAngle(distance: number)
  {
    const velocity = this.getAngularVelocity();

    return (velocity > 0 && distance < 0) || (velocity < 0 && distance > 0);
  }

  // --- Update On Waypoint Change ---

// +
  private updateBrakingAngle()
  {
    // const desiredPosition = this.getWaypointPosition();
    // const currentPosition = this.getPosition();
    // const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);
    // const desiredRotation = Angle.zeroTo2Pi(targetVector.getRotation());
    const desiredRotation = this.getWaypointDirection();
    const angularDistance = Angle.minusPiToPi
    (
      desiredRotation - this.getRotation().valueOf()
    );

    const halfAngularDistance = Math.abs(angularDistance / 2);
    const maxBrakingAngle = this.maxBrakingAngle.valueOf();

    // The idea here is that if we don't have time to reach
    // maximum possible angular velocity, it will take exactly
    // half the distance to accelerate and another half to
    // deccelerate.
    //   If we do have time to reach maximum velocity, than
    // braking distance is a constant (because maximum velocity
    // is a constant, too) so we just assign it.
    if (halfAngularDistance < maxBrakingAngle)
    {
      this.brakingAngle.set(halfAngularDistance);
    }
    else
    {
      this.brakingAngle.set(maxBrakingAngle);
    }
  }

  // --- Arrive Steering Force ---

// .
  // ! Throws exception on error.
  private computeArriveSteeringForce()
  {
    // ! Throws exception on error.
    const targetVector = this.computeTargetVector();
    const distance = targetVector.length();

    if (distance > 0)
      this.updateWaypointDirection();

    const fullBrakingThrust = this.computeBrakingThrust(targetVector);

    // ! Throws exception on error.
    this.updateBrakingDistance(fullBrakingThrust);

    // ! Throws exception on error.
    const desiredSpeed = this.computeDesiredSpeed(distance, fullBrakingThrust);

    this.desiredVelocity.set(targetVector).setLength(desiredSpeed);

    const velocityChange = this.computeVelocityChange();

    // ! Throws exception on error.
    const thrust = this.computeSteeringThrust(velocityChange);

    return new Vector(velocityChange).setLength(thrust);
  }

  private computeVelocityChange()
  {
    // ! Throws exception on error.
    const currentVelocity = this.getVelocity();

    return Vector.v1MinusV2(this.desiredVelocity, currentVelocity);
  }

// .
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

// .
  // ! Throws exception on error.
  private computeThrustValue(velocityChange: Vector, fullThrust: number)
  {
    // ! Throws exception on error.
    const mass = this.massValue;
    const desiredSpeedChange = velocityChange.length();

    // Compute thrust needed to reach desired speed in one tick
    // (this handles the last tick when we don't need full thrust
    //  to come to stop).
    const desiredThrust = mass * desiredSpeedChange * Engine.FPS;

    // Cap it to full thrust.
    return Number(desiredThrust).atMost(fullThrust);
  }

// .
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

// .
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

// .
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

// .
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

// .
  private computeBrakingThrust(targetVector: Vector)
  {
    const thrustData = this.computeThrustData(Vector.negate(targetVector));

    return this.computeThrustFromRatios
    (
      thrustData.forwardThrustRatio,
      thrustData.leftwardThrustRatio
    );
  }

// .
  // ! Throws exception on error.
  private updateBrakingDistance(fullBrakingThrust: number)
  {
    this.brakingDistance = computeBrakingDistance
    (
      this.massValue,
      this.currentMaxSpeed,
      // ! Throws exception on error.
      fullBrakingThrust
    );
  }

// .
  private angleToShip(direction: Vector)
  {
    const shipRotation = this.getRotation().valueOf();
    const directionRotation = direction.getRotation();

    return Angle.zeroTo2Pi(directionRotation - shipRotation);
  }

// .
  private computeDesiredSpeed
  (
    distance: number,
    fullBrakingThrust: number,
  )
  : number
  {
    // This can happen if currentMaxSpeed is zero or if braking thrust is zero.
    if (this.brakingDistance === 0)
      return 0;

    // Distance travelled by velocity achieved by one tick of
    // acceleration at fullBrakingThrust (which is the same as
    // distance travelled in the last tick of decceleration).
    // const oneTickDistance = Engine.SPF * fullBrakingThrust / this.massValue;

    // d = F / (m * FPS * FPS * 2);
    const oneTickDistance =
      fullBrakingThrust / (this.massValue * Engine.FPS * Engine.FPS * 2);

    // What's going on here:
    //   Speed calculated based on 'distance' is actually desired speed for
    // our current position. Because that position is iterated towards
    // target position, desired speed would never reach zero (or at least
    // it would take a whole lot of iterations). To handle it we skip the
    // last step and set desired velocity directly to zero.
    //   Note that at the time of writing this (end of 2018) there is a bug
    // in Box2d physics engine causing speed to reset periodically to zero
    // when a small constant force is applied instead of it linearly
    // increasing. This causes ship to stutter at the final approach phase
    // if it's thrust is low (for example if you move sideways so you only
    // use weak strafe thrusters). Hopefully that will get addressed sometime.
    if (distance < oneTickDistance)
      return 0;

    let desiredSpeed = Math.sqrt
    (
      distance * fullBrakingThrust * 2 / this.massValue
    );

    // In the previous step we have calculated velocity that we would
    // have to have at current position in order to brake exactly at
    // the target. But we are there already there so by the time we
    // deccelerate to such speed, we will already be closer so our
    // speed in the next tick actually needs to be lower. By how much,
    // you ask? By decceleration which will occur in the next tick, of
    // course.
    //  (If we didn't subtract change in velocity that will occur in
    // the next tick, our current velocity would lag behind desired
    // velocity more and more, because speed is not linear to distance
    // when deccelerating. We actually wouldn't be able to deccelerate
    // fast enough to slow down enough, which would lead to overshooting
    // the target - the more the greater distance we would have to travel).
    desiredSpeed -= fullBrakingThrust / (this.massValue * Engine.FPS);

    desiredSpeed = Number(desiredSpeed).atMost(this.currentMaxSpeed);

    // There is a hard speed limit in Box2d.
    // Check that we are not exceeding it.
    return this.validateSpeed(desiredSpeed);
  }

// .
  // ! Throws exception on error.
  private validateSpeed(speed: number)
  {
    if (speed > Physics.MAXIMUM_POSSIBLE_SPEED)
    {
      throw new Error(`Vehicle ${this.entity.debugId} attempts to reach`
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
      throw new Error(`Vehicle ${this.entity.debugId} attempts to reach`
        + ` angular velocity '${angularVelocity}' which is greater than`
        + ` maximum angular velocity allowed by Box2d physics engine`
        + ` (${Physics.MAXIMUM_POSSIBLE_ANGULAR_VELOCITY}). There are`
        + ` two ways to handle this: 1 -  Make sure that maximum angular`
        + ` velocity for this vehicle doesn't exceed this limit, 2 - increase`
        + ` engine FPS (that effectively increases maximum possible angular`
        + ` velocity)`);
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

// .
function computeBrakingDistance(m: number, v: number, F: number)
{
  if (F === 0)
    return 0;

  return (m * v * v) / (F * 2);
}

function computeDesiredRotation(targetVector: Vector)
{
  return Angle.zeroTo2Pi(targetVector.getRotation());
}

function distanceFromOrigin(x: number, y: number)
{
  return Math.sqrt(x * x + y * y);
}