/*
  Part of Kosmud

  Vehicle physics properties and behaviour.
*/

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

import { Syslog } from "../../Shared/Log/Syslog";
import { Angle } from "../../Shared/Utils/Angle";
import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Engine } from "../../Shared/Engine/Engine";
import { Zone } from "../../Shared/Game/Zone";
import { Entity } from "../../Shared/Class/Entity";
import { Physics } from "../../Shared/Physics/Physics";
import { Coords } from "../../Shared/Engine/Coords";
import { Serializable } from "../../Shared/Class/Serializable";

// Tohle je kvůli tomu, aby se na konci manévru setnula nulová desired
// velocity. Nejspíš to ale pořeším jinak - směr budu držet zvlášť
// a desired velocity bude rovnou nulová.
// const STOPPED_DISTANCE = pixels(1);
// const STOPPED_ANGLE = Math.PI / 100;

type ArrivePhase = "Accelerating" | "Braking";

export class VehiclePhysics extends Serializable
{
  /// Nechám to zatím CAPSEM. Časem to možná nebudou konstanty
  /// (protože se budou měnit debufama a tak, tak to pak případně
  ///  přejmenuju. Ale popravdě by asi bylo lepší nechat základ konstantní
  ///  a případný modifikátor přičítat/přinásobovat)
  // public readonly MAX_SPEED = 200;
  // public readonly FORWARD_THRUST = 100;
  // public readonly BACKWARD_THRUST = 20;
  // public readonly STRAFE_THRUST = 5;
  // public readonly ANGULAR_VELOCITY = Math.PI * 2;
  // public readonly TORQUE = 500;
  // public readonly BRAKING_DISTANCE = 20;
  // public readonly BRAKING_SPEED = this.MAX_SPEED / 100;
  public readonly MAX_SPEED = 2;
  public readonly FORWARD_THRUST = 1;
  public readonly BACKWARD_THRUST = 0.2;
  public readonly STRAFE_THRUST = 0.5;
  // public readonly ANGULAR_VELOCITY = Math.PI * 2;
  public readonly MAX_ANGULAR_VELOCITY = Math.PI / 2;
  // public readonly TORQUE = 5;
  public readonly TORQUE = 0.1;
  // public readonly STOPPING_DISTANCE = pixels(20);
  // public readonly STOPPING_ANGLE = Math.PI / 20;
  // public readonly BRAKING_SPEED = this.MAX_SPEED / 100;

  // public shapeId: string | "Not set" = "Not set";
  /// V zásadě asi není důvod, proč by 'shapeId' nemohlo být setnuté vždycky.
  /// Entita ho zdědí z prototypy a přepíše.
  /// (A výhledově tady beztak bude reference na entitu Shape).
  public shapeId = "<missing physics shape id>";
  /// Tohle je sice divně malý číslo, ale když ho zvětším, tak pak musej
  /// bejt mnohem větší všechny thrusty, torques a tak a vektory
  /// jsou pak přes celou obrazovku (mohl bych je teda scalovat, když na to
  /// příjde).
  public density = 1000;
  public friction = 0.5;       // Value: 0 to 1.
  // 0 - almost no bouncing, 1 - maximum bouncing.
  public restitution = 1;      // Value: 0 to 1.

  /// TODO: Až budu chtít PhysicsBody savovat, tak musím tohle pořešit.
  ///   Property 'initialPosition' se totiž používá jen při vkládání
  /// do physics worldu - getPosition() potom vytahuje pozici s physicsBody.
  ///   Možná to bude chtít custom savování/loadování, protože při savu
  /// je potřeba nejdřív vytáhnout aktuální pozici z this.body a pak až ji
  /// savnout. A při loadu se pak zas musí body vytvořit.
  public readonly initialPosition = { x: 0, y: 0 };
  public initialRotation = 0;

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
  public desiredRotation = 0;

  /// TODO: Tohle by se nemělo savovat (až budu řešit savování).
  // protected readonly physicsBody = new PhysicsBody(this);
  private physicsBody: PhysicsBody | "Not in physics world" =
    "Not in physics world";

  private brakingAngle = 0;
  private maxBrakingAngle = 0;
  private angleDeltaPerTick = 0;
  private arriveAngularPhase: ArrivePhase = "Braking";

  constructor(private readonly entity: Entity)
  {
    super();
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
      return new MinusOneToOne(this.forwardThrust / this.FORWARD_THRUST);
    else
      return new MinusOneToOne(this.forwardThrust / this.BACKWARD_THRUST);
  }

  public getLeftwardThrustRatio()
  {
    return new MinusOneToOne(this.leftwardThrust / this.STRAFE_THRUST);
  }

  public getTorqueRatio()
  {
    return new MinusOneToOne(this.torque / this.TORQUE);
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

  // ! Throws exception on error.
  protected arrive()
  {
    const currentPosition = this.getPosition();
    const desiredPosition = this.waypoint;
    // ! Throws exception on error.
    const currentVelocity = this.getVelocity();
    // ! Throws exception on error.
    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = Angle.zeroTo2Pi(this.getRotation());
    const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);
    const distance = targetVector.length();
    const brakingDistance = this.computeBrakingDistance(currentVelocity);
  /// Test rotace:
  // const linearPhase = determineLinearPhase(distance, brakingDistance);
    const linearPhase = "Braking";
    const desiredSpeed = this.getDesiredSpeed(linearPhase);

    // ! Throws exception on error.
    this.validateSpeed(desiredSpeed);

    const desiredVelocity = new Vector(targetVector).setLength(desiredSpeed);

    const desiredSteeringForce = Vector.v1MinusV2
    (
      desiredVelocity,
      currentVelocity
    );

    // Rotaci počítám z targetVectoru místo z desiredVelocity,
    // protože při brždění je desiredVelocity nulová a nedá se
    // z ní tudíž rotace spočítat.
    this.desiredRotation = computeDesiredRotation
    (
      linearPhase, currentRotation, targetVector, desiredSteeringForce
    );

  /// Disablováno na testování rotace.
    // this.computeLinearForces
    // (
    //   desiredSteeringForce,
    //   desiredVelocity,
    //   currentVelocity,
    //   currentRotation
    // );

    // ! Throws exception on error.
    const currentAngularVelocity = this.getAngularVelocity();
    // Make sure we turn the right way.
    const angularDistance = Angle.minusPiToPi
    (
      this.desiredRotation - currentRotation
    );

    // // Updatovat braking angle pouze při akceleraci
    // // (možná bude problém při znovuzrychlování, uvidíme).
    // if (this.arriveAngularPhase === "Accelerating")
    // {
    //   this.brakingAngle = this.computeBrakingAngle(currentAngularVelocity);
    // }
    // else
    // {
    //   /// IDEA: Číslo o kousek větší než úhel, který mi ještě zbejvá.
    //   /// (too sleepy to thing...)
    //   this.brakingAngle = Math.abs(angularDistance) + Number.EPSILON;
    // }

    this.arriveAngularPhase = determineAngularPhase
    (
      angularDistance, this.brakingAngle
    );

// console.log(angularDistance, this.brakingAngle, this.arriveAngularPhase);

    const desiredAngularVelocity = this.getDesiredAngularVelocity
    (
      this.arriveAngularPhase, angularDistance
    );

    // console.log
    // (
    //   // this.desiredRotation,
    //   // currentRotation,
    //   angularDistance,
    //   this.brakingAngle,
    //   this.arriveAngularPhase,
    //   desiredAngularVelocity
    // );

    // console.log
    // (
    //   this.desiredRotation, angularDistance, angularPhase, brakingAngle
    // );

    // this.computeAngularForces
    // (
    //   currentRotation,
    //   this.desiredRotation,
    //   angularDistance,
    //   angularPhase
    // );
    this.computeAngularForces(desiredAngularVelocity);

    this.brakingDistance = brakingDistance;
    // this.stoppingDistance = this.STOPPING_DISTANCE;
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
  private init()
  {
    // ! Throws exception on error.
    this.updateAngleDeltaPerTick();
    this.updateMaxBrakingAngle();
  }

  // ! Throws exception on error.
  private updateAngleDeltaPerTick()
  {
    // ! Throws exception on error.
    const inertia = this.getPhysicsBody().getInertia();
    const acceleration = this.TORQUE / inertia;

    this.angleDeltaPerTick = acceleration / Engine.FPS;

    console.log(`Updating angleDeltaPerTick to ${this.angleDeltaPerTick}`);
  }

  private updateBrakingAngle(waypoint: { x: number; y: number })
  {
    const currentPosition = this.getPosition();
    const desiredPosition = this.waypoint;

    const targetVector = Vector.v1MinusV2(desiredPosition, currentPosition);

    const desiredRotation = Angle.zeroTo2Pi(targetVector.getRotation());

    const angularDistance = Angle.minusPiToPi
    (
      desiredRotation - this.getRotation()
    );

    const halfAngularDistance = Math.abs(angularDistance / 2);
    const maxBrakingAngle = Math.abs(this.maxBrakingAngle);

    // The idea here is that if we don't have time
    // to reach maximum possible velocity, it will
    // take exactly half the distance to accelerate
    // and another half to deccelerate.
    //   If we do reach maximum velocity, than braking
    // distance is a constant (because maximum velocity
    // is a constant, too) so we just assign it.
    if (halfAngularDistance < maxBrakingAngle)
    {
      this.brakingAngle = halfAngularDistance;

      console.log
      (
        `Setting braking angle to half the angular distance`
        + ` ${halfAngularDistance}`
      );
    }
    else
    {
      this.brakingAngle = this.maxBrakingAngle;

      console.log
      (
        `Setting braking angle to maximum braking angle`
        + ` ${this.maxBrakingAngle}`
      );
    }

/// Tohle možná ani nebude potřeba, pokud bude gradual approach fungovat dobře.
    // // Add 'this.angleDeltaPerTick' because we are not braking perfectly
    // // (we use gradual approach for the last tick).
    // this.brakingAngle = halfAngularDistance + this.angleDeltaPerTick;
  }

  private updateMaxBrakingAngle()
  {
    this.maxBrakingAngle = computeBrakingDistance
    (
      this.MAX_ANGULAR_VELOCITY,
      this.getPhysicsBody().getInertia(),
      this.TORQUE
    );

    console.log(`Updating maxBrakingAngle to ${this.maxBrakingAngle}`);
  }

  // ! Throws exception on error.
  private getPhysicsBody()
  {
    if (this.physicsBody === "Not in physics world")
    {
      throw new Error(`${this.entity.debugId} is not in physics wolrd`
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
    if (desiredForwardComponentLength > this.FORWARD_THRUST)
    {
      forwardLimitRatio =
        this.FORWARD_THRUST / desiredForwardComponentLength;
    }
    else if (desiredForwardComponentLength < -this.BACKWARD_THRUST)
    {
      forwardLimitRatio =
        -this.BACKWARD_THRUST / desiredForwardComponentLength;
    }
    let strafeLimitRatio = 1;
    if (desiredLeftwardComponentLength > this.STRAFE_THRUST)
    {
      strafeLimitRatio =
        this.STRAFE_THRUST / desiredLeftwardComponentLength;
    }
    else if (desiredLeftwardComponentLength < -this.STRAFE_THRUST)
    {
      strafeLimitRatio =
        -this.STRAFE_THRUST / desiredLeftwardComponentLength;
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

    // ! Throws exception on error.
  private computeAngularForces
  (
    // currentRotation: number,
    // desiredRotation: number,
    // angularDistance: number,
    // angularPhase: ArrivePhase
    desiredAngularVelocity: number
  )
  {
    // ! Throws exception on error.
    const inertia = this.getPhysicsBody().getInertia();

    // const acceleration = this.TORQUE / inertia;
    // const angleDeltaPerTick = acceleration / Engine.FPS;

    const currentAngularVelocity = this.getPhysicsBody().getAngularVelocity();

    const desiredVelocityChange =
      desiredAngularVelocity - currentAngularVelocity;

/*
Tohle bude jinak.
  Musím nějak zjistit, jestli mám zrychlovat nebo zpomalovat.
  - i když vlastně to možná dělám...
    (desiredVelocityDelta v sobě zahrnuje směr (znaménkem)
*/
    // console.log("   ", currentAngularVelocity, desiredVelocityChange);

    // console.log(currentAngularVelocity);

    if (Math.abs(desiredVelocityChange) < Math.abs(this.angleDeltaPerTick))
    {
      /// Tohle by mě ve skutečnosti mělo hodit přesně na nulovou velocity.

      // a = desiredVelocityChange;
      // const m = inertia;
      // F = m * a

      // Gradual approach.
      // this.torque = inertia * desiredVelocityChange * Engine.FPS;
      this.torque = inertia * desiredVelocityChange;

      // console.log(`Gradual approarch`, this.torque);
    }
    else
    {
      // Full torque.
      this.torque = (desiredVelocityChange > 0) ? this.TORQUE : -this.TORQUE;
    }

  // // ! Throws exception on error.
  // const oldAngularVelocity = this.getPhysicsBody().getAngularVelocity();

  // if (currentRotation < 0 || currentRotation > Math.PI * 2)
  //   throw new Error(`'currentRotation' out of bounds: ${currentRotation}`);

  // if (desiredRotation < 0 || desiredRotation > Math.PI * 2)
  //   throw new Error(`'desiredRotation' out of bounds: ${desiredRotation}`);

  // // ! Throws exception on error.
  // const inertia = this.getPhysicsBody().getInertia();

  // const desiredAngularVelocity = computeDesiredAngularVelocity
  // (
  //   desiredRotation, currentRotation
  // );

  // const newAngularVelocity = Number(desiredAngularVelocity).clampTo
  // (
  //   -this.ANGULAR_VELOCITY, this.ANGULAR_VELOCITY
  // );

  // // Multiplication by 'FPS' prevents overturning the desired angle
  // // (as suggested by Box2D example).
  // const torque =
  //   inertia * (newAngularVelocity - oldAngularVelocity) * Engine.FPS;

  // this.torque = Number(torque).clampTo(-this.TORQUE, this.TORQUE);
  }

  // ! Throws exception on error.
  private computeBrakingDistance(velocity: Vector)
  {
    // ! Throws exception on error.
    const m = this.getPhysicsBody().getMass();
    const v = velocity.length();
    const F = this.BACKWARD_THRUST;

    // d = (1/2 * mass * v^2) / Force;
    // const brakingDistance = this.STOPPING_DISTANCE + (m * v * v) / (F * 2);
    return (m * v * v) / (F * 2);

    // return brakingDistance;
  }

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

  private getDesiredSpeed(linearPhase: ArrivePhase)
  {
    switch (linearPhase)
    {
      case "Accelerating":
        return this.MAX_SPEED;

      case "Braking":
        return 0;

      default:
        throw Syslog.reportMissingCase(linearPhase);
    }
  }

  private getDesiredAngularVelocity
  (
    angularPhase: ArrivePhase,
    angularDistance: number
  )
  {
    switch (angularPhase)
    {
      case "Accelerating":
        if (angularDistance > 0 && angularDistance < Math.PI)
        {
          return this.MAX_ANGULAR_VELOCITY;
        }
        else
        {
          return -this.MAX_ANGULAR_VELOCITY;
        }

      case "Braking":
        return 0;

      default:
        throw Syslog.reportMissingCase(angularPhase);
    }
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

function pixels(value: number)
{
  return Coords.ClientToServer.distance(value);
}

function computeDesiredAngularVelocity
(
  desiredRotation: number,
  currentRotation: number
)
: number
{
  let desiredAngularVelocity = desiredRotation - currentRotation;

  // Make sure that we turn the shorter way.
  if (desiredAngularVelocity > Math.PI)
    desiredAngularVelocity -= Math.PI * 2;
  if (desiredAngularVelocity < -Math.PI)
    desiredAngularVelocity += Math.PI * 2;

  return desiredAngularVelocity;
}

function determineLinearPhase(distance: number, brakingDistance: number)
: ArrivePhase
{
  if (distance > brakingDistance)
    return "Accelerating";

  return "Braking";
}

function determineAngularPhase
(
  angularDistance: number,
  brakingAngle: number
)
: ArrivePhase
{
  if (Math.abs(angularDistance) > brakingAngle)
    return "Accelerating";

  return "Braking";
}

function computeDesiredRotation
(
  maneuverPhase: ArrivePhase,
  currentRotation: number,
  targetVector: Vector,
  desiredSteeringForce: Vector
)
{
  switch (maneuverPhase)
  {
    case "Accelerating":
      /// Zaremováno schválně.
      // return Angle.normalize(desiredSteeringForce.getRotation());

    case "Braking":
      // When we are braking, turn in the direction of desired velocity.
      return Angle.zeroTo2Pi(targetVector.getRotation());

    // case "Stopping":
    // case "Stopped":
    //   // If we are stopped or nearly stopped, pass current rotation
    //   // as desired rotation to prevent rotating in-place
    //   // (it doesn't work perfectly but it helps a bit).
    //   return Angle.normalize(currentRotation);

    default:
      throw Syslog.reportMissingCase(maneuverPhase);
  }
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