/*
  Part of Kosmud

  Vehicle physics properties and behaviour.
*/

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

// type ThrustDirection = "Forward" | "Backward" | "Left" | "Right";
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

  // // These are variables. They change whenever something temporarily
  // // modifies physics characteristics of the vehicle.
  // public readonly currentMaxSpeed =
  //   new PositiveNumber(this.MAX_SPEED.valueOf());
  // public readonly currentForwardThrust =
  //   new PositiveNumber(this.FORWARD_THRUST.valueOf());
  // public readonly currentBackwardThrust =
  //   new PositiveNumber(this.BACKWARD_THRUST.valueOf());
  // public readonly currentStrafeThrust =
  //   new PositiveNumber(this.STRAFE_THRUST.valueOf());
  // public readonly currentMaxAngularVelocity =
  //   new PositiveNumber(this.MAX_ANGULAR_VELOCITY.valueOf());
  // public readonly currentAngularThrust =
  //   new PositiveNumber(this.ANGULAR_THRUST.valueOf());

  /// TODO: Až budu chtít PhysicsBody savovat, tak musím tohle pořešit.
  ///   Property 'initialPosition' se totiž používá jen při vkládání
  /// do physics worldu - getPosition() potom vytahuje pozici s physicsBody.
  ///   Možná to bude chtít custom savování/loadování, protože při savu
  /// je potřeba nejdřív vytáhnout aktuální pozici z this.body a pak až ji
  /// savnout. A při loadu se pak zas musí body vytvořit.
  public readonly initialPosition = { x: 0, y: 0 };
  public readonly initialRotation = new ZeroTo2Pi(0);

  // Waypoint je trochu stranou - zapisuje se do něj cílová pozice.
  public readonly waypoint = new Vector();

  /// (Mohlo by to mít vlastní objekt.)
  // These variables are sent to client to draw debug graphics.
  // public readonly forwardSteeringForce = new Vector();
  // public readonly leftwardSteeringForce = new Vector();
  // public readonly desiredSteeringForce = new Vector();
  // public readonly desiredForwardSteeringForce = new Vector();
  // public readonly desiredLeftwardSteeringForce = new Vector();
  // public forwardThrust = 0;
  // public leftwardThrust = 0;
  // Not used anymore (afaik).
  // public approachForce = 0;
  public torque = 0;
  // Not used anymore (afaik).
  // public stoppingDistance = 0;
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

  // Tohle se používá při výpočtu agular steeringu.
  private readonly brakingAngle = new ZeroToPi(0);
  private readonly maxBrakingAngle = new ZeroToPi(0);
  private readonly angularVelocityIncrement = new NonnegativeNumber(0);

  /// TEST
  private lastTickSpeed = 0;

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
  // public getDesiredSteeringForce() { return this.desiredSteeringForce; }
  // public getDesiredForwardSteeringForce()
  // {
  //   return this.desiredForwardSteeringForce;
  // }
  // public getDesiredLeftwardSteeringForce()
  // {
  //   return this.desiredLeftwardSteeringForce;
  // }
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
  // public getForwardThrustRatio(): MinusOneToOne
  // {
  //   if (this.forwardThrust >= 0)
  //   {
  //     return new MinusOneToOne
  //     (
  //       this.forwardThrust / this.FORWARD_THRUST.valueOf()
  //     );
  //   }
  //   else
  //   {
  //     return new MinusOneToOne
  //     (
  //       this.forwardThrust / this.BACKWARD_THRUST.valueOf()
  //     );
  //   }
  // }

  public getLeftwardThrustRatio() { return this.leftwardThrustRatio; }
  // public getLeftwardThrustRatio()
  // {
  //   return new MinusOneToOne
  //   (
  //     this.leftwardThrust / this.STRAFE_THRUST.valueOf()
  //   );
  // }

  public getTorqueRatio()
  {
    return this.torqueRatio;
    // return new MinusOneToOne(this.torque / this.ANGULAR_THRUST.valueOf());
  }

  public setWaypoint(waypoint: { x: number; y: number })
  {
    this.waypoint.set(waypoint);

    this.updateBrakingAngle(waypoint);
    // this.updateBrakingDistance(waypoint);
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
    // this.getPhysicsBody().applyForce(new Vector({ x: 0.019, y: 0 }));
    // this.getPhysicsBody().applyImpulse
    // (
    //   // Vector.scaleBy(this.steeringForce, 1 / Engine.FPS)
    //   new Vector({ x: 0.0001, y: 0 })
    // );
    // console.log(this.getVelocity());

    // const speed = this.getVelocity().length();
    // console.log(speed - this.lastTickSpeed);
    // this.lastTickSpeed = speed;

    // ! Throws exception on error.
    this.getPhysicsBody().applyTorque(this.torque);
  }

  // --------------- Protected methods ------------------

// +
  // ! Throws exception on error.
  protected arrive()
  {
    /// TEST
    // this.torque = this.computeArriveTorque();

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
      this.updateBrakingAngle(this.waypoint);
    }

    // Note that reversing after overtaking the desired angle is also
    // computed as acceleration (just in the opposite direction).
    //   It's a "Deccelerate" action only when we want to slow down to
    // stop.
    const action = this.determineAngularAction(distance);

    let torque;

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

  // --- Update On Waypoint Change ---

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

// -------------- BACKUP ----------------------------

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

// private updateForwardThrust
// (
//   steeringForce: Vector,
//   forwardUnitVector: Vector
// )
// {
//   // The formula includes division by magnitude of vector we are projecting
//   // into - but that is a unit vector so we don't have to do that.
//   this.forwardThrust = Vector.v1DotV2
//   (
//     steeringForce,
//     forwardUnitVector
//   );
// }

// private updateLeftwardThrust
// (
//   steeringForce: Vector,
//   leftwardUnitVector: Vector
// )
// {
//   // The formula includes division by magnitude of vector we are projecting
//   // into - but that is a unit vector so we don't have to do that.
//   this.leftwardThrust = Vector.v1DotV2
//   (
//     steeringForce,
//     leftwardUnitVector
//   );
// }

// // ! Throws exception on error.
// private computeLinearForces
// (
//   desiredSteeringForce: Vector,
//   desiredVelocity: Vector,
//   currentVelocity: Vector,
//   currentRotation: number,
// )
// {

//   // 3.5 Split desiredSteeringForce to it's Forward/Backward and
//   // Left/Right part.

//   // Math guide:
//   // https://math.oregonstate.edu/home/programs/undergrad/
//   //   CalculusQuestStudyGuides/vcalc/dotprod/dotprod.html

//   const leftwardRotation = Angle.zeroTo2Pi(currentRotation + Math.PI / 2);
//   const forwardUnitVector = Vector.rotate({ x: 1, y: 0 }, currentRotation);
//  const leftwardUnitVector = Vector.rotate({ x: 1, y: 0 }, leftwardRotation);

//   /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
//   /// ale jednotkový, takže lomeno 1.
//   const desiredForwardComponentLength = Vector.v1DotV2
//   (
//     desiredSteeringForce,
//     forwardUnitVector
//   );

//   /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
//   /// ale jednotkový, takže lomeno 1.
//   const desiredLeftwardComponentLength = Vector.v1DotV2
//   (
//     desiredSteeringForce,
//     leftwardUnitVector
//   );

//   const desiredForwardSteeringForce = Vector.scaleBy
//   (
//     forwardUnitVector,
//     desiredForwardComponentLength
//   );

//   const desiredLeftwardSteeringForce = Vector.scaleBy
//   (
//     leftwardUnitVector,
//     desiredLeftwardComponentLength
//   );

//   /// Update: Zjistím, ve kterém směru se force redukuje ve větším poměru
//   /// a tímhle poměrem pak pronásobím desiredSteeringForce.
//   // const desiredSteeringForceMagnitude = desiredSteeringForce.length();
//   let forwardLimitRatio = 1;
//   const fullForwardThrust = this.currentForwardThrustValue;
//   const fullBackwardThrust = this.currentBackwardThrustValue;
//   const fullStrafeThrust = this.currentStrafeThrustValue;

//   if (desiredForwardComponentLength > fullForwardThrust)
//   {
//     forwardLimitRatio = fullForwardThrust / desiredForwardComponentLength;
//   }
//   else if (desiredForwardComponentLength < -fullBackwardThrust)
//   {
//     forwardLimitRatio = -fullBackwardThrust / desiredForwardComponentLength;
//   }
//   let strafeLimitRatio = 1;
//   if (desiredLeftwardComponentLength > fullStrafeThrust)
//   {
//     strafeLimitRatio = fullStrafeThrust / desiredLeftwardComponentLength;
//   }
//   else if (desiredLeftwardComponentLength < -fullStrafeThrust)
//   {
//     strafeLimitRatio = -fullStrafeThrust / desiredLeftwardComponentLength;
//   }
//   const steeringLimitRatio = Math.min(forwardLimitRatio, strafeLimitRatio);

//   if (steeringLimitRatio < 0 || steeringLimitRatio > 1)
//     throw new Error(`Invalid steeringLimitRatio (${steeringLimitRatio})`);

//   const steeringForce = Vector.scaleBy
//   (
//     desiredSteeringForce,
//     steeringLimitRatio
//   );

//   // this.updateForwardThrust(steeringForce, forwardUnitVector);
//   // this.updateLeftwardThrust(steeringForce, leftwardUnitVector);

//   this.desiredVelocity.set(desiredVelocity);
//   this.steeringForce.set(steeringForce);
//   // this.desiredSteeringForce.set(desiredSteeringForce);
//   // this.desiredForwardSteeringForce.set(desiredForwardSteeringForce);
//   // this.desiredLeftwardSteeringForce.set(desiredLeftwardSteeringForce);
// }

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

// ------ END OF BACKUP ----------------------------

  // --- Arrive Steering Force ---

// .
  // ! Throws exception on error.
  private computeArriveSteeringForce()
  {
    // ! Throws exception on error.
    const targetVector = this.computeTargetVector();

    const fullBrakingThrust = this.computeBrakingThrust(targetVector);

    // console.log("fullBrakingThrust:", fullBrakingThrust);

    // ! Throws exception on error.
    this.updateBrakingDistance(targetVector, fullBrakingThrust);

    // ! Throws exception on error.
    this.updateDesiredVelocity(targetVector, fullBrakingThrust);

    return this.computeForceToReachVelocity();
  }

// .
  // ! Throws exception on error.
  private computeForceToReachVelocity()
  {
    // ! Throws exception on error.
    const currentVelocity = this.getVelocity();

    const velocityChange = Vector.v1MinusV2
    (
      this.desiredVelocity, currentVelocity
    );

    // ! Throws exception on error.
    const thrust = this.computeSteeringThrust(velocityChange);

    // console.log("Thrust:", thrust);

    return new Vector(velocityChange).setLength(thrust);
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

    // a = F / m.
    const fullThrustAcceleration = fullThrust / mass;
    const fullThrustSpeedChange = fullThrustAcceleration / Engine.FPS;

    // If we would exceed desired velocity in the next tick, calculate
    // the exact thrust to reach it.
    if (desiredSpeedChange < fullThrustSpeedChange)
    {
      // /// TEST
      // const speed = this.getVelocity().length();
      // console.log("speed change:", Math.abs(speed - this.lastTickSpeed));
      // this.lastTickSpeed = speed;
      // console.log(this.getVelocity());

  // // // console.log("Stopping", desiredSpeedChange, fullThrustSpeedChange);
  // console.log("desiredSpeedChange", desiredSpeedChange);
  // console.log(this.getVelocity());

      console.log
      (
        "desiredSpeedChange:", desiredSpeedChange,
        "fullThrustSpeedChange:", fullThrustSpeedChange
      );

      // F = m * a
      return mass * desiredSpeedChange * Engine.FPS;
      // return mass * desiredSpeedChange;

      /// Varianta přes vzdálenost - taky nedojde k přesnýmu zastavení :\
      /// (Určitě s tím souvisí bug s resetováním rychlosti při malé
      ///  akceleraci, ale i tak by to mělo zastavit hned.)
      /*
      const v = this.getVelocity().length();
      const distance = this.computeTargetVector().length();
      if (distance === 0)
        return 0;
      return (mass * v * v) / (2 * distance);
      */
    }
    else
    {
      // console.log("Full thrust", desiredSpeedChange, fullThrustSpeedChange);

      // console.log("FULL THRUST", fullThrust);

      // Otherwise just give it all that we have.
      return fullThrust;
    }
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
  // private updateThrustRatios(direction: ThrustDirection, thrust: number)
  // {
  //   switch (direction)
  //   {
  //     case "Forward":
  //       this.forwardThrustRatio = thrust / this.FORWARD_THRUST.valueOf();
  //       this.leftwardThrustRatio = 0;
  //       break;

  //     case "Backward":
  //       this.forwardThrustRatio = -thrust / this.BACKWARD_THRUST.valueOf();
  //       this.leftwardThrustRatio = 0;
  //       break;

  //     case "Left":
  //       this.leftwardThrustRatio = -thrust / this.STRAFE_THRUST.valueOf();
  //       this.forwardThrustRatio = 0;
  //       break;

  //     case "Right":
  //       this.leftwardThrustRatio = thrust / this.STRAFE_THRUST.valueOf();
  //       this.forwardThrustRatio = 0;
  //       break;

  //     default:
  //       throw Syslog.reportMissingCase(direction);
  //   }
  // }

// .
  // ! Throws exception on error.
  private computeTargetVector()
  {
    return Vector.v1MinusV2
    (
      this.waypoint,
      // ! Throws exception on error.
      this.getPosition()
    );

    /*
    // Target vector is used to compute desired velocity. The idea
    // here is that we are not going to use our current position for
    // that but rather our projected position in the next tick using
    // our current velocity - we are going to compute velocity desired
    // in the next tick after all.
    //   This is not precies but it's better than to calculate using
    // current position.
    const nextTickTranslation = Vector.scaleBy(this.getVelocity(), Engine.SPF);

    return Vector.v1MinusV2
    (
      this.waypoint,
      // ! Throws exception on error.
      Vector.v1PlusV2(this.getPosition(), nextTickTranslation)
    );
    */
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
  private updateBrakingDistance
  (
    targetVector: Vector,
    fullBrakingThrust: number
  )
  {
    // const fullBrakingThrust = this.computeBrakingThrust(targetVector);

    this.brakingDistance = computeBrakingDistance
    (
      this.massValue,
      this.currentMaxSpeed,
      // ! Throws exception on error.
      fullBrakingThrust
    );

    // console.log("this.brakingDistance:", this.brakingDistance);
  }

// .
  private angleToShip(direction: Vector)
  {
    const shipRotation = this.getRotation().valueOf();
    const directionRotation = direction.getRotation();

    return Angle.zeroTo2Pi(directionRotation - shipRotation);
  }

  // private thrustDirection(direction: Vector): ThrustDirection
  // {
  //   const shipRotation = this.getRotation().valueOf();
  //   const directionRotation = direction.getRotation();

  //   const angle = Angle.zeroTo2Pi(shipRotation - directionRotation);

  //   if (angle < Angle.PI / 8 || angle > 15 * Angle.PI / 8)
  //     return "Forward";

  //   if (angle > 7 * Angle.PI / 8 && angle < 9 * Angle.PI / 8)
  //     return "Backward";

  //   if (angle >= Angle.PI / 8 && angle <= 7 * Angle.PI / 8)
  //     return "Left";

  //   // (angle >= 9 * Angle.PI / 8 && angle <= 15 * Angle.PI / 8)
  //   return "Right";
  // }

  // private getThrustInDirection(direction: ThrustDirection)
  // {
  //   switch (direction)
  //   {
  //     case "Forward":
  //       return this.currentForwardThrustValue;

  //     case "Backward":
  //      return this.currentBackwardThrustValue;

  //     case "Left":
  //     case "Right":
  //       return this.currentStrafeThrustValue;

  //     default:
  //       throw Syslog.reportMissingCase(direction);
  //   }
  // }

// .
  // ! Throws exception on error.
  private updateDesiredVelocity
  (
    targetVector: Vector,
    fullBrakingThrust: number
  )
  {
    /*
    const brakingPerTick = computeBrakingDistance
    (
      this.massValue,
      this.getVelocity().length(),
      fullBrakingThrust
    );
    /// Tohle je skoro dobrý (funguje to - končí se fakt full stopem),
    /// jen musím vymyslet, jak přesně spočítat tu stopping vzdálenost.

// const nextTickTranslation = Vector.scaleBy(this.getVelocity(), Engine.SPF);
    console.log(targetVector.length(), brakingPerTick);
    // if (nextTickTranslation.length() > targetVector.length())
    // if (targetVector.length() < 0.01)
    if (targetVector.length() < brakingPerTick)
    {
      console.log("SETTING ZERO DESIRED VELOCITY");
      this.desiredVelocity.set({ x: 0, y: 0 });
      return;
    }
    */

    // a = F / m
    // const decceleration = fullBrakingThrust / this.massValue;
    // Distance travelled by velocity achieved by one tick of
    // acceleration at fullBrakingThrust (which is the same as
    // distance travelled in the last tick of decceleration).
    // const oneTickDistance = decceleration / Engine.FPS;

    // // console.log(targetVector.length(), oneTickVelocity);

    // if (targetVector.length() < oneTickDistance)
    // {
    //   console.log("SETTING ZERO DESIRED VELOCITY");
    //   this.desiredVelocity.set({ x: 0, y: 0 });
    //   return;
    // }

    // ! Throws exception on error.
    const desiredSpeed = this.computeDesiredSpeed
    (
      targetVector, fullBrakingThrust
    );

// // There is a hard speed limit in Box2d. Make sure we don't exceed it.
// this.validateSpeed(desiredSpeed);

// // const speed = this.getVelocity().length();
// console.log
// (
//   // "acceleration:", speed - this.lastTickSpeed,
//   "calculated acceleration:", desiredSpeed - this.lastTickSpeed,
//   "correct decceleration:", decceleration / Engine.FPS

// );
// // this.lastTickSpeed = speed;
// this.lastTickSpeed = desiredSpeed;

    // console.log
    // (
    //   "Current speed", this.getVelocity().length(),
    //   "DesiredSpeed", desiredSpeed,
    //   this.getVelocity().length() - desiredSpeed
    // );

    this.desiredVelocity.set(targetVector).setLength(desiredSpeed);
  }

// .
  private computeDesiredSpeed
  (
    targetVector: Vector,
    fullBrakingThrust: number
  )
  : number
  {
    // This can happen if currentMaxSpeed is zero or if braking thrust is zero.
    if (this.brakingDistance === 0)
      return 0;

    const distance = targetVector.length();
    // const distance = this.getVelocity().length();

// // Distance travelled by velocity achieved by one tick of
// // acceleration at fullBrakingThrust (which is the same as
// // distance travelled in the last tick of decceleration).
    const oneTickDistance = Engine.SPF * fullBrakingThrust / this.massValue;

// // What's going on here:
// // Speed calculated based on 'distance' is actually desired speed for
// // our current position. Because that position is iterated towards
// // target position, desired speed would never reach zero (or at least
// // it would take a whole lot of iterations). To handle it we skip the
// // last step and set desired velocity directly to zero.
// //   Note that at the time of writing this (end of 2018) there is a bug
// // in Box2d physics engine causing speed to reset periodically to zero
// // when a small constant force is applied instead of it linearly
// // increasing. This causes ship to stutter at the final approach phase
// // if it's thrust is low (for example if you move sideways so you only
// // use weak strafe thrusters). Hopefully that will get addressed sometime.
    if (distance < oneTickDistance)
      return 0;

    // const projectedDistance = Number(distance - oneTickDistance).atLeast(0);

    const desiredSpeed = Math.sqrt
    (
      distance * fullBrakingThrust * 2 / this.massValue
    );

    return Number(desiredSpeed).atMost(this.currentMaxSpeed);

    console.log
    (
      "Current speed:", this.getVelocity().length(),
      "Computed speed:",
      this.currentMaxSpeed * distance / this.brakingDistance,
      "Correct speed:", desiredSpeed
    );

    // if (distance < this.brakingDistance)
    if (distance < this.brakingDistance)
    {
      // console.log
      // (
      //   "Computed braking distance:",
      //   computeBrakingDistance
      //   (
      //     this.massValue,
      //     this.currentMaxSpeed * distance / this.brakingDistance,
      //     0.5
      //   ),
      //   "Current distance:", distance
      // );

      // Since we have constant thrust, speed grows linearly. It
      // means that we can use linear interpolation to find out
      // what speed should we have at any point.
      return this.currentMaxSpeed * distance / this.brakingDistance;
      // return 1.2 * this.currentMaxSpeed * distance / this.brakingDistance;
    }

    return this.currentMaxSpeed;
  }

/*
  private computeArriveSteeringForce()
  {
    /// Jinak:
    /// 1) Spočítat seeking force.
    // ! Throws exception on error.
    const desiredSeekingForce = this.computeDesiredSeekingForce();

  // /// 2) Projektovat ji do směru k cíli.
  // // ! Throws exception on error.
  // const approachForceLength = this.computeApproachForceLength(seekingForce);

    /// 3) Spočítat braking distance.
    this.updateBrakingDistance(desiredSeekingForce);

    /// 4) Při akceleraci aplikovat celou seeking force,
    ///    při dekceleraci ji downscalnout

    const distance = this.computeLinearDistance();

    const action = this.determineLinearAction(distance);

    switch (action)
    {
      case "Accelerate":
        // return this.computeAccelerationForce(distance);
        return this.computeSeekingForce(desiredSeekingForce);

      case "Deccelerate":
        return this.computeApproachForce(distance);

      default:
        throw Syslog.reportMissingCase(action);
    }
  }

  // ! Throws exception on error.
  private computeDesiredSeekingForce()
  {
    // ! Throws exception on error.
    const currentVelocity = this.getVelocity();
    // ! Throws exception on error.
    const currentPosition = this.getPosition();
    const desiredPosition = this.waypoint;

    // 1. 'desired velocity' = 'desired position' - 'current position'.
    const targetVector = Vector.v1MinusV2
    (
      desiredPosition, currentPosition
    );

    // 2. Scale 'desired velocity' to maximum speed.
    const desiredVelocity = new Vector(targetVector).setLength
    (
      this.currentMaxSpeedValue
    );

    return Vector.v1MinusV2
    (
      desiredVelocity, currentVelocity
    );
  }

  private computeSeekingForce(desiredSeekingForce: Vector)
  {
    // ! Throws exception on error.
    const currentPosition = this.getPosition();
    const desiredPosition = this.waypoint;

    // 1. 'desired velocity' = 'desired position' - 'current position'.
    const targetVector = Vector.v1MinusV2
    (
      desiredPosition, currentPosition
    );

    const fullThrust = this.thrustInDirection(targetVector);

    if (desiredSeekingForce.length() > fullThrust)
      return desiredSeekingForce.setLength(fullThrust);

    return desiredSeekingForce;
  }

  private computeApproachForce(distance: number)
  {
    /// Tady jsem se rozhodl, udělat to celý jinak.
  }

  // // ! Throws exception on error.
  // private computeSeekingForce()
  // {
  //   // ! Throws exception on error.
  //   const currentVelocity = this.getVelocity();
  //   // ! Throws exception on error.
  //   const currentPosition = this.getPosition();
  //   const desiredPosition = this.waypoint;

  //   // 1. 'desired velocity' = 'desired position' - 'current position'.
  //   const targetVector = Vector.v1MinusV2
  //   (
  //     desiredPosition, currentPosition
  //   );

  //   // 2. Scale 'desired velocity' to maximum speed.
  //   const desiredVelocity = new Vector(targetVector).setLength
  //   (
  //     this.currentMaxSpeedValue
  //   );

  //   const desiredSeekingForce = Vector.v1MinusV2
  //   (
  //     desiredVelocity, currentVelocity
  //   );

  //   const fullThrust = this.thrustInDirection(targetVector);

  //   if (desiredSeekingForce.length() > fullThrust)
  //     return desiredSeekingForce.setLength(fullThrust);

  //   return desiredSeekingForce;
  // }

  // // ! Throws exception on error.
  // private computeApproachForceLength(seekingForce: Vector)
  // {
  //   // ! Throws exception on error.
  //   const currentPosition = this.getPosition();
  //   const desiredPosition = this.waypoint;

  //   const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);

  //   /// TODO: Složka seekingForce ve směru targetVectoru.
  //   return seekingForce.projectionTo(targetVector);
  // }

  private updateBrakingDistance(seekingForce: Vector)
  {
    const desiredPosition = this.waypoint;
    const currentPosition = this.getPosition();
    const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);

    const approachForceLength = seekingForce.lengthInDirection(targetVector);

    const d = targetVector.length();

    const v = this.getVelocity().lengthInDirection(targetVector);
    const fAcc = approachForceLength;
    const fDecc = this.thrustInDirection(Vector.negate(targetVector));
    // ! Throws exception on error.
    const m = this.massValue;

    this.brakingDistance = (2 * d * fAcc + m * v * v) / ((fAcc + fDecc) * 2);

    // console.log(`Setting braking distance to`, this.brakingDistance);
  }

// {
// // // Správně mě zajímá složka směrem k cíli.
// // const v = this.getVelocity().length();
//   const fAcc = 0.5;
//   const fDecc = 0.2;
// // // ! Throws exception on error.
// // const m = this.getPhysicsBody().getMass().valueOf();

//   this.updateApproachForce();

//   const distance = this.computeLinearDistance();

//   const action = this.determineLinearAction(distance);

//   switch (action)
//   {
//     case "Accelerate":
//       return this.computeAccelerationForce(distance);

//     case "Deccelerate":
//       return this.computeDeccelerationForce(distance);

//     default:
//       throw Syslog.reportMissingCase(action);
//   }

 // const brakingDistance = (2 * d * fAcc + m * v * v) / ((fAcc + fDecc) * 2);

//   let arriveSteeringForce: Vector;

//   if (distance > this.brakingDistance)
//     arriveSteeringForce = targetVector.setLength(fAcc);
//   else
//     arriveSteeringForce = targetVector.setLength(-fDecc);

//   console.log(arriveSteeringForce);

//   return arriveSteeringForce;
// }

  private updateApproachForce()
  {
    /// TODO: Počítat to podle natočení lodi.
    this.approachForce = 0.5;
  }

  private computeLinearDistance()
  {
    const currentPosition = this.getPosition();
    const desiredPosition = this.waypoint;
    const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);

    return targetVector.length();
  }

  private determineLinearAction(distance: number)
  : "Accelerate" | "Deccelerate"
  {
    const distanceIncrement = this.computeDistanceIncrement();
    const brakingDistance = this.brakingDistance.valueOf();

// We compare the angle where we would be the next tick with
// braking angle (which is the smallest angle when we need to start
// deccelerating in order to stop at desired angle) instead of our
// current angle because physics is simulated in discrete steps
// and if we started deccelerating after we exceeded the braking angle,
// we wouldn't be able to stop in time.
    if (Math.abs(distance - distanceIncrement) > brakingDistance)
    {
      return "Accelerate";
    }
    else
    {
      return "Deccelerate";
    }
  }

  // ! Throws exception on error.
  private computeDistanceIncrement()
  {
    // a = F / m
    // ! Throws exception on error.
    const acceleration = this.approachForce / this.massValue;
    const velocityIncrement = acceleration / Engine.FPS;
    const nextTickVelocity = this.getAngularVelocity() + velocityIncrement;

    return nextTickVelocity / Engine.FPS;
  }

// private updateBrakingDistance(desiredPosition: { x: number; y: number })
// {
//   // Správně mě zajímá složka směrem k cíli.
//   const v = this.getVelocity().length();
//   const fAcc = 0.5;
//   const fDecc = 0.2;
//   // ! Throws exception on error.
//   const m = this.massValue;

//   const currentPosition = this.getPosition();
//   const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);
//   const d = targetVector.length();

//   this.brakingDistance = (2 * d * fAcc + m * v * v) / ((fAcc + fDecc) * 2);

//   console.log(`Setting braking distance to`, this.brakingDistance);
// }
*/
}

// ----------------- Auxiliary Functions ---------------------

// .
function computeBrakingDistance(m: number, v: number, F: number)
{
  if (F === 0)
    return 0;

  return (m * v * v) / (F * 2);
}

// function pixels(value: number)
// {
//   return Coords.ClientToServer.distance(value);
// }

// function determineLinearPhase(distance: number, brakingDistance: number)
// : ArrivePhase
// {
//   if (distance > brakingDistance)
//     return "Accelerating";

//   return "Braking";
// }

function computeDesiredRotation(targetVector: Vector)
{
  return Angle.zeroTo2Pi(targetVector.getRotation());
}

function distanceFromOrigin(x: number, y: number)
{
  return Math.sqrt(x * x + y * y);
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