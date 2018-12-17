/*
  Part of Kosmud

  Vehicle physics properties and behaviour.
*/

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

import { Syslog } from "../../Shared/Log/Syslog";
import { Angle } from "../../Shared/Utils/Angle";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
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

type ArrivePhase = "Accelerating" | "Braking";

export class VehiclePhysics extends Serializable
{
  // These are constants. They only change if you install a new engine
  // into the vehicle or something like that.
  public readonly MAX_SPEED = new PositiveNumber(2);
  public readonly FORWARD_THRUST = new PositiveNumber(1);
  public readonly BACKWARD_THRUST = new PositiveNumber(0.2);
  public readonly STRAFE_THRUST = new PositiveNumber(0.5);
  public readonly MAX_ANGULAR_VELOCITY = new PositiveNumber(Math.PI / 2);
  public readonly ANGULAR_THRUST = new PositiveNumber(0.1);

  public readonly DENSITY = new PositiveNumber(1000);
  public readonly FRICTION = new ZeroToOne(0.5);
  // 0 - almost no bouncing, 1 - maximum bouncing.
  public readonly RESTITUTION = new ZeroToOne(1);

  // These are variables. They change whenever something temporarily
  // modifies physics characteristics of the vehicle.
  public readonly currentMaxSpeed =
    new PositiveNumber(this.MAX_SPEED.valueOf());
  public readonly currentForwardThrust =
    new PositiveNumber(this.FORWARD_THRUST.valueOf());
  public readonly currentBackwardThrust =
    new PositiveNumber(this.BACKWARD_THRUST.valueOf());
  public readonly currentStrafeThrust =
    new PositiveNumber(this.STRAFE_THRUST.valueOf());
  public readonly currentMaxAngularVelocity =
    new PositiveNumber(this.MAX_ANGULAR_VELOCITY.valueOf());
  public readonly currentAngularThrust =
    new PositiveNumber(this.ANGULAR_THRUST.valueOf());

  /// TODO: Až budu chtít PhysicsBody savovat, tak musím tohle pořešit.
  ///   Property 'initialPosition' se totiž používá jen při vkládání
  /// do physics worldu - getPosition() potom vytahuje pozici s physicsBody.
  ///   Možná to bude chtít custom savování/loadování, protože při savu
  /// je potřeba nejdřív vytáhnout aktuální pozici z this.body a pak až ji
  /// savnout. A při loadu se pak zas musí body vytvořit.
  public readonly initialPosition = { x: 0, y: 0 };
  public readonly initialRotation = new ZeroTo2Pi(0);

  public readonly waypoint = new Vector();
  public readonly desiredVelocity = new Vector();
  public readonly steeringForce = new Vector();
  public readonly forwardSteeringForce = new Vector();
  public readonly leftwardSteeringForce = new Vector();
  public readonly desiredSteeringForce = new Vector();
  public readonly desiredForwardSteeringForce = new Vector();
  public readonly desiredLeftwardSteeringForce = new Vector();
  public forwardThrust = 0;
  public leftwardThrust = 0;
  public torque = 0;
  public brakingDistance = 0;
  public stoppingDistance = 0;
  public desiredRotation = new ZeroTo2Pi(0);

  public shapeId = "<missing physics shape id>";

  /// TODO: Tohle by se nemělo savovat (až budu řešit savování).
  // protected readonly physicsBody = new PhysicsBody(this);
  private physicsBody: PhysicsBody | "Not in physics world" =
    "Not in physics world";

  private readonly brakingAngle = new ZeroToPi(0);
  private readonly maxBrakingAngle = new ZeroToPi(0);
  private readonly angularVelocityIncrement = new NonnegativeNumber(0);

  constructor(private readonly entity: Entity)
  {
    super();
  }

  // --------------- Public accessors -------------------

  public get currentMaxSpeedValue()
  {
    return this.currentMaxSpeed.valueOf();
  }

  public get currentForwardThrustValue()
  {
    return this.currentForwardThrust.valueOf();
  }

  public get currentBackwardThrustValue()
  {
    return this.currentBackwardThrust.valueOf();
  }

  public get currentStrafeThrustValue()
  {
    return this.currentStrafeThrust.valueOf();
  }

  public get currentMaxAngularVelocityValue()
  {
    return this.currentMaxAngularVelocity.valueOf();
  }

  public get currentAngularThrustValue()
  {
    return this.currentAngularThrust.valueOf();
  }

  // ! Throws exception on error.
  public get inertiaValue()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getInertia().valueOf();
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
  public getDesiredSteeringForce() { return this.desiredSteeringForce; }
  public getDesiredForwardSteeringForce()
  {
    return this.desiredForwardSteeringForce;
  }
  public getDesiredLeftwardSteeringForce()
  {
    return this.desiredLeftwardSteeringForce;
  }
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

  public getForwardThrustRatio(): MinusOneToOne
  {
    if (this.forwardThrust >= 0)
    {
      return new MinusOneToOne
      (
        this.forwardThrust / this.FORWARD_THRUST.valueOf()
      );
    }
    else
    {
      return new MinusOneToOne
      (
        this.forwardThrust / this.BACKWARD_THRUST.valueOf()
      );
    }
  }

  public getLeftwardThrustRatio()
  {
    return new MinusOneToOne
    (
      this.leftwardThrust / this.STRAFE_THRUST.valueOf()
    );
  }

  public getTorqueRatio()
  {
    return new MinusOneToOne(this.torque / this.ANGULAR_THRUST.valueOf());
  }

  public setWaypoint(waypoint: { x: number; y: number })
  {
    this.waypoint.set(waypoint);

    this.updateBrakingAngle(waypoint);
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
      this.updateBrakingAngle(this.waypoint);
    }

// +
    // Note that reversing after overtaking the desired angle is also
    // computed as acceleration (just in the opposite direction).
    //   It's a "Deccelerate" action only when we want to slow down to
    // stop.
    const action = this.determineAngularAction(distance);

    switch (action)
    {
      case "Accelerate":
        return this.computeAccelerationTorque(distance);

      case "Deccelerate":
        return this.computeDeccelerationTorque(distance);

      default:
        throw Syslog.reportMissingCase(action);
    }
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

    const fullThrust = this.currentAngularThrustValue;

    // If we won't reach desired angular velocity in this tick we apply
    // maximum possible torque in respective direction.
    return (desiredVelocity > 0) ? fullThrust : -fullThrust;
  }

  private computeDesiredAngularVelocity
  (
    distance: number,
    currentVelocity: number
  )
  {
    const maxVelocity = this.currentMaxAngularVelocityValue;
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
    const fullThrust = this.currentAngularThrustValue;

    // Ensure that we don't exceed our maximum torque. This can happen
    // when something pushes us or when player sets reversed direction.
    // In that case we will overshoot our desired rotation because we
    // simply can't deccelerate fast enough.
    return Number(desiredTorque).clampTo(-fullThrust, fullThrust);
  }

// +
  // ! Throws exception on error.
  private init()
  {
    // ! Throws exception on error.
    this.updateAngularVelocityInrement();
    this.updateMaxBrakingAngle();
  }

// +
  // ! Throws exception on error.
  private updateAngularVelocityInrement()
  {
    // ! Throws exception on error.
    const acceleration = this.currentAngularThrustValue / this.inertiaValue;

    this.angularVelocityIncrement.set(acceleration / Engine.FPS);
  }

// +
  private updateBrakingAngle(desiredPosition: { x: number; y: number })
  {
    const currentPosition = this.getPosition();
    const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);
    const desiredRotation = Angle.zeroTo2Pi(targetVector.getRotation());
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

// +
  // ! Throws exception on error.
  private updateMaxBrakingAngle()
  {
    const maxBrakingAngle = computeBrakingDistance
    (
      this.currentMaxAngularVelocityValue,
      // ! Throws exception on error.
      this.inertiaValue,
      this.currentAngularThrustValue
    );

    this.maxBrakingAngle.set(maxBrakingAngle);
  }

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

// private computeArriveDesiredVelocity
// (
//   targetVector: Vector,
//   oldVelocity: Vector,
//   distance: number
// )
// {
//   const brakingDistance = this.computeBrakingDistance(oldVelocity);
//   const desiredVelocity = new Vector(targetVector);

//   if (distance > brakingDistance)
//   {
//     // Same as 'seek' behaviour (scale 'desired velocity' to maximum speed).
//     desiredVelocity.setLength(MAX_SPEED);
//   }
//   else if (distance > STOPPING_DISTANCE)
//   {
//     // Break almost to zero velocity
//     // (zero velocity is not a good idea because zero vector
//     //  has undefined direction).
//     desiredVelocity.setLength(STOPPING_SPEED);
//   }
//   else
//   {
//     // console.log("stopping...");

//     if (brakingDistance <= 1)
//     {
//       desiredVelocity.setLength(0);
//     }
//     else
//     {
//       // Use gradual approach at STOPPING_DISTANCE.
//       desiredVelocity.setLength
//       (
//         STOPPING_SPEED * distance / STOPPING_DISTANCE
//       );
//     }
//   }

//   return desiredVelocity;
// }

  private updateForwardThrust
  (
    steeringForce: Vector,
    forwardUnitVector: Vector
  )
  {
    // The formula includes division by magnitude of vector we are projecting
    // into - but that is a unit vector so we don't have to do that.
    this.forwardThrust = Vector.v1DotV2
    (
      steeringForce,
      forwardUnitVector
    );
  }

  private updateLeftwardThrust
  (
    steeringForce: Vector,
    leftwardUnitVector: Vector
  )
  {
    // The formula includes division by magnitude of vector we are projecting
    // into - but that is a unit vector so we don't have to do that.
    this.leftwardThrust = Vector.v1DotV2
    (
      steeringForce,
      leftwardUnitVector
    );
  }

  // ! Throws exception on error.
  private computeLinearForces
  (
    desiredSteeringForce: Vector,
    desiredVelocity: Vector,
    currentVelocity: Vector,
    currentRotation: number,
  )
  {

    // 3.5 Split desiredSteeringForce to it's Forward/Backward and
    // Left/Right part.

    // Math guide:
    // https://math.oregonstate.edu/home/programs/undergrad/
    //   CalculusQuestStudyGuides/vcalc/dotprod/dotprod.html

    const leftwardRotation = Angle.zeroTo2Pi(currentRotation + Math.PI / 2);
    const forwardUnitVector = Vector.rotate({ x: 1, y: 0 }, currentRotation);
    const leftwardUnitVector = Vector.rotate({ x: 1, y: 0 }, leftwardRotation);

    /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
    /// ale jednotkový, takže lomeno 1.
    const desiredForwardComponentLength = Vector.v1DotV2
    (
      desiredSteeringForce,
      forwardUnitVector
    );

    /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
    /// ale jednotkový, takže lomeno 1.
    const desiredLeftwardComponentLength = Vector.v1DotV2
    (
      desiredSteeringForce,
      leftwardUnitVector
    );

    const desiredForwardSteeringForce = Vector.scale
    (
      forwardUnitVector,
      desiredForwardComponentLength
    );

    const desiredLeftwardSteeringForce = Vector.scale
    (
      leftwardUnitVector,
      desiredLeftwardComponentLength
    );

    /// Update: Zjistím, ve kterém směru se force redukuje ve větším poměru
    /// a tímhle poměrem pak pronásobím desiredSteeringForce.
    // const desiredSteeringForceMagnitude = desiredSteeringForce.length();
    let forwardLimitRatio = 1;
    const fullForwardThrust = this.currentForwardThrustValue;
    const fullBackwardThrust = this.currentBackwardThrustValue;
    const fullStrafeThrust = this.currentStrafeThrustValue;

    if (desiredForwardComponentLength > fullForwardThrust)
    {
      forwardLimitRatio = fullForwardThrust / desiredForwardComponentLength;
    }
    else if (desiredForwardComponentLength < -fullBackwardThrust)
    {
      forwardLimitRatio = -fullBackwardThrust / desiredForwardComponentLength;
    }
    let strafeLimitRatio = 1;
    if (desiredLeftwardComponentLength > fullStrafeThrust)
    {
      strafeLimitRatio = fullStrafeThrust / desiredLeftwardComponentLength;
    }
    else if (desiredLeftwardComponentLength < -fullStrafeThrust)
    {
      strafeLimitRatio = -fullStrafeThrust / desiredLeftwardComponentLength;
    }
    const steeringLimitRatio = Math.min(forwardLimitRatio, strafeLimitRatio);

    if (steeringLimitRatio < 0 || steeringLimitRatio > 1)
      throw new Error(`Invalid steeringLimitRatio (${steeringLimitRatio})`);

    const steeringForce = Vector.scale
    (
      desiredSteeringForce,
      steeringLimitRatio
    );

    this.updateForwardThrust(steeringForce, forwardUnitVector);
    this.updateLeftwardThrust(steeringForce, leftwardUnitVector);

    this.desiredVelocity.set(desiredVelocity);
    this.steeringForce.set(steeringForce);
    this.desiredSteeringForce.set(desiredSteeringForce);
    this.desiredForwardSteeringForce.set(desiredForwardSteeringForce);
    this.desiredLeftwardSteeringForce.set(desiredLeftwardSteeringForce);
  }

// // ! Throws exception on error.
// private computeBrakingDistance(velocity: Vector)
// {
//   // ! Throws exception on error.
//   const m = this.getPhysicsBody().getMass().valueOf();
//   const v = velocity.length();
//   const F = this.BACKWARD_THRUST.valueOf();

//   // d = (1/2 * mass * v^2) / Force;
//   // const brakingDistance = this.STOPPING_DISTANCE + (m * v * v) / (F * 2);
//   return (m * v * v) / (F * 2);

//   // return brakingDistance;
// }

  // private computeBrakingAngle(angularVelocity: number)
  // {
  //   // ! Throws exception on error.
  //   const m = this.getPhysicsBody().getInertia();
  //   const v = angularVelocity;
  //   const F = this.TORQUE;

  //   // d = (1/2 * mass * v^2) / Force;
  //   // const brakingDistance = this.STOPPING_ANGLE + (i * v * v) / (F * 2);
  //   return (m * v * v) / (F * 2);

  //   // return brakingDistance;
  // }

  // private getDesiredSpeed(linearPhase: ArrivePhase)
  // {
  //   switch (linearPhase)
  //   {
  //     case "Accelerating":
  //       return this.MAX_SPEED;

  //     case "Braking":
  //       return 0;

  //     default:
  //       throw Syslog.reportMissingCase(linearPhase);
  //   }
  // }

// +
  private computeAngularDistance()
  {
    const desiredPosition = this.waypoint;
    const currentPosition = this.getPosition();

    const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);

    const desiredRotation = computeDesiredRotation(targetVector);
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

  // ! Throws exception on error.
  private validateSpeed(desiredSpeed: number)
  {
    if (desiredSpeed > Physics.MAXIMUM_POSSIBLE_SPEED)
    {
      throw new Error(`Vehicle ${this.entity.debugId} attempts to reach`
        + ` speed '${desiredSpeed}' which is greater than maximum speed`
        + ` allowed by physics engine (${Physics.MAXIMUM_POSSIBLE_SPEED}).`
        + ` There are three ways to handle this: 1 - set lower maximum`
        + ` speed for this vehicle, 2 - change coords transformation ratio in`
        + ` CoordsTransform so the same speed in pixels translates to lower`
        + ` speed in physics engine, 3 - increase engine FPS (that effectively`
        + ` increases maximum possible speed)`);
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

function computeBrakingDistance(v: number, m: number, F: number)
{
  // d = (1/2 * mass * v^2) / Force;
  return (m * v * v) / (F * 2);
}

// function pixels(value: number)
// {
//   return Coords.ClientToServer.distance(value);
// }

function determineLinearPhase(distance: number, brakingDistance: number)
: ArrivePhase
{
  if (distance > brakingDistance)
    return "Accelerating";

  return "Braking";
}

function computeDesiredRotation(targetVector: Vector)
{
  return Angle.zeroTo2Pi(targetVector.getRotation());
}

/*
Backup kódu (z computeLinearForces()):
  (varianta, kdy se desiredForce rozložila na forward a leftward
  složku, ty se každá zvlášť ořezaly podle thrustu do příslušného
  směru a výsledek se složil zpět)
{
  const forwardForceMagnitude = intervalBound
  (
    desiredForwardComponentMagnitude,
    { from: -BACKWARD_THRUST, to: FORWARD_THRUST }
  );

  const leftwardForceMagnitude = intervalBound
  (
    desiredLeftwardComponentMagnitude,
    { from: -STRAFE_THRUST, to: STRAFE_THRUST }
  );

  const forwardSteeringForce = Vector.scale
  (
    forwardUnitVector,
    forwardForceMagnitude
  );

  const leftwardSteeringForce = Vector.scale
  (
    leftwardUnitVector,
    leftwardForceMagnitude
  );

  const steeringForce = Vector.v1PlusV2
  (
    forwardSteeringForce,
    leftwardSteeringForce
  );
}
*/