/*
  Part of Kosmud

  Vehicle physics properties and behaviour.
*/

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

import { Angle } from "../../Shared/Utils/Angle";
import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Engine } from "../../Shared/Engine/Engine";
import { Zone } from "../../Shared/Game/Zone";
import { Entity } from "../../Shared/Class/Entity";
import { Serializable } from "../../Shared/Class/Serializable";

export class VehiclePhysics extends Serializable
{
  /// Nechám to zatím CAPSEM. Časem to možná nebudou konstanty
  /// (protože se budou měnit debufama a tak, tak to pak případně
  ///  přejmenuju. Ale popravdě by asi bylo lepší nechat základ konstantní
  ///  a případný modifikátor přičítat/přinásobovat až )
  public readonly MAX_SPEED = 200;
  public readonly FORWARD_THRUST = 100;
  public readonly BACKWARD_THRUST = 20;
  public readonly STRAFE_THRUST = 5;
  public readonly ANGULAR_VELOCITY = Math.PI * 2;
  public readonly TORQUE = 500;
  public readonly STOPPING_DISTANCE = 20;
  public readonly STOPPING_SPEED = this.MAX_SPEED / 100;

  // public shapeId: string | "Not set" = "Not set";
  /// V zásadě asi není důvod, proč by 'shapeId' nemohlo být setnuté vždycky.
  /// Entita ho zdědí z prototypy a přepíše.
  /// (A výhledově tady beztak bude reference na entitu Shape).
  public shapeId = "<missing physics shape id>";
  /// Tohle je sice divně malý číslo, ale když ho zvětším, tak pak musej
  /// bejt mnohem větší všechny thrusty, torques a tak a vektory
  /// jsou pak přes celou obrazovku (mohl bych je teda scalovat, když na to
  /// příjde).
  public density = 0.00001;
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

  /// TODO: Tohle by se nemělo savovat (až budu řešit savování).
  // protected readonly physicsBody = new PhysicsBody(this);
  private physicsBody: PhysicsBody | "Not in physics world" =
    "Not in physics world";

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
  }

  // ! Throws exception on error.
  public getShape()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getShape();
  }

  /// Něco v tomhle smyslu tu asi zůstane, ale bude to vyrábět
  /// this.physicsBody().
  // ! Throws exception on error.
  public addToPhysicsWorld(physicsWorld: PhysicsWorld, zone: Zone)
  {
    const physicsShape = zone.getPhysicsShape(this.shapeId);

    this.physicsBody = physicsWorld.createPhysicsBody
    (
      this.entity, this, physicsShape
    );

    // // ! Throws exception on error.
    // physicsWorld.add(this.getPhysicsBody(), zone);

    // ! Throws exception on error.
    // Set waypoint to the new position so the vehicle doesn't
    // go back to where it was.
    this.waypoint.set(this.getPhysicsBody().getPosition());
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
    const vehiclePosition = this.getPosition();
    const targetPosition = this.waypoint;
    // ! Throws exception on error.
    const oldVelocity = this.getPhysicsBody().getVelocity();
    // ! Throws exception on error.
    const vehicleRotation = this.getPhysicsBody().getRotation();

    const targetVector = Vector.v1MinusV2(targetPosition, vehiclePosition);
    const distance = targetVector.length();

    const brakingDistance = this.computeBrakingDistance(oldVelocity);
    const desiredVelocity = new Vector(targetVector);

    let rotationFlip = 0;

    if (distance > brakingDistance)
    {
      // Same as 'seek' behaviour (scale 'desired velocity' to maximum speed).
      desiredVelocity.setLength(this.MAX_SPEED);

      rotationFlip = 0;
    }
    else if (distance > this.STOPPING_DISTANCE)
    {
      rotationFlip = Math.PI;

      // Break almost to zero velocity
      // (zero velocity is not a good idea because zero vector
      //  has undefined direction).
      desiredVelocity.setLength(this.STOPPING_SPEED);
    }
    else if (distance > 1)
    {
      // console.log("stopping...");

      rotationFlip = Math.PI;
      // Use gradual approach at STOPPING_DISTANCE.
      desiredVelocity.setLength
      (
        this.STOPPING_SPEED * distance / this.STOPPING_DISTANCE
      );
    }
    else
    {
      rotationFlip = 0;
      desiredVelocity.setLength(0);
    }

    this.computeLinearForces
    (
      desiredVelocity,
      oldVelocity,
      vehicleRotation
    );

    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = Angle.normalize(vehicleRotation);

    /// Zkusím se točit k desiredSteeringForce místo k desiredRotation.
    // let desiredRotation = desiredVelocity.getRotation();
    let desiredRotation = Angle.normalize
    (
      /// 'rotationFlip' je 0 při zrychlování a PI při zpomalování,
      /// protože při brždění musí čumák koukat na opačnou stranu než
      /// kam směřuje desiredSteeringForce.
      this.desiredSteeringForce.getRotation() + rotationFlip
    );

    if (distance <= this.STOPPING_DISTANCE)
    {
      // If we are in final "braking down" phase, pass current
      // rotation as desired rotation to prevent tuning in-place
      // (it doesn't work wery well but it helps a bit).
      desiredRotation = currentRotation;
    }

    this.computeAngularForces(currentRotation, desiredRotation);
  }

  // ! Throws exception on error.
  protected seek()
  {
    // ! Throws exception on error.
    const vehicleVelocity = this.getPhysicsBody().getVelocity();
    const vehiclePosition = this.getPosition();
    const targetPosition = this.waypoint;
    const vehicleRotation = this.getRotation();

    // 1. 'desired velocity' = 'target position' - 'vehicle position'.
    const desiredVelocity = Vector.v1MinusV2(targetPosition, vehiclePosition);

    // 2. Scale 'desired velocity' to maximum speed.
    desiredVelocity.setLength(this.MAX_SPEED);

    this.computeLinearForces
    (
      desiredVelocity,
      vehicleVelocity,
      vehicleRotation
    );

    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = Angle.normalize(vehicleRotation);
    const desiredRotation = desiredVelocity.getRotation();

    this.computeAngularForces(currentRotation, desiredRotation);
  }

  // ---------------- Private methods -------------------

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
    desiredVelocity: Vector,
    vehicleVelocity: Vector,
    vehicleRotation: number,
  )
  {
    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = Angle.normalize(vehicleRotation);

    // 3. 'steering force' = 'desired velocity' - 'current velocity'.
    const desiredSteeringForce = Vector.v1MinusV2
    (
      desiredVelocity,
      vehicleVelocity
    );

    // 3.5 Split desiredSteeringForce to it's Forward/Backward and
    // Left/Right part.

    // Math guide:
    // https://math.oregonstate.edu/home/programs/undergrad/
    //   CalculusQuestStudyGuides/vcalc/dotprod/dotprod.html

    const leftwardRotation = Angle.normalize(currentRotation + Math.PI / 2);
    const forwardUnitVector = Vector.rotate({ x: 1, y: 0 }, currentRotation);
    const leftwardUnitVector = Vector.rotate({ x: 1, y: 0 }, leftwardRotation);

    /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
    /// ale jednotkový, takže lomeno 1.
    const desiredForwardComponentMagnitude = Vector.v1DotV2
    (
      desiredSteeringForce,
      forwardUnitVector
    );

    /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
    /// ale jednotkový, takže lomeno 1.
    const desiredLeftwardComponentMagnitude = Vector.v1DotV2
    (
      desiredSteeringForce,
      leftwardUnitVector
    );

    const desiredForwardSteeringForce = Vector.scale
    (
      forwardUnitVector,
      desiredForwardComponentMagnitude
    );

    const desiredLeftwardSteeringForce = Vector.scale
    (
      leftwardUnitVector,
      desiredLeftwardComponentMagnitude
    );

    /// Update: Zjistím, ve kterém směru se force redukuje ve větším poměru
    /// a tímhle poměrem pak pronásobím desiredSteeringForce.
    // const desiredSteeringForceMagnitude = desiredSteeringForce.length();
    let forwardLimitRatio = 1;
    if (desiredForwardComponentMagnitude > this.FORWARD_THRUST)
    {
      forwardLimitRatio =
        this.FORWARD_THRUST / desiredForwardComponentMagnitude;
    }
    else if (desiredForwardComponentMagnitude < -this.BACKWARD_THRUST)
    {
      forwardLimitRatio =
        -this.BACKWARD_THRUST / desiredForwardComponentMagnitude;
    }
    let strafeLimitRatio = 1;
    if (desiredLeftwardComponentMagnitude > this.STRAFE_THRUST)
    {
      strafeLimitRatio =
        this.STRAFE_THRUST / desiredLeftwardComponentMagnitude;
    }
    else if (desiredLeftwardComponentMagnitude < -this.STRAFE_THRUST)
    {
      strafeLimitRatio =
        -this.STRAFE_THRUST / desiredLeftwardComponentMagnitude;
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
    currentRotation: number,
    desiredRotation: number
  )
  {
    // ! Throws exception on error.
    const oldAngularVelocity = this.getPhysicsBody().getAngularVelocity();

    if (currentRotation < 0 || currentRotation > Math.PI * 2)
      throw new Error(`'currentRotation' out of bounds: ${currentRotation}`);

    if (desiredRotation < 0 || desiredRotation > Math.PI * 2)
      throw new Error(`'desiredRotation' out of bounds: ${desiredRotation}`);

    // ! Throws exception on error.
    const inertia = this.getPhysicsBody().getInertia();

    const desiredAngularVelocity = computeDesiredAngularVelocity
    (
      desiredRotation, currentRotation
    );

    const newAngularVelocity = Number(desiredAngularVelocity).clampTo
    (
      -this.ANGULAR_VELOCITY, this.ANGULAR_VELOCITY
    );

    // Multiplication by 'FPS' prevents overturning the desired angle
    // (as suggested by Box2D example).
    let torque =
      inertia * (newAngularVelocity - oldAngularVelocity) * Engine.FPS;

    torque = Number(torque).clampTo(-this.TORQUE, this.TORQUE);

    this.torque = torque;
  }

  // ! Throws exception on error.
  private computeBrakingDistance(velocity: Vector)
  {
    // ! Throws exception on error.
    const mass = this.getPhysicsBody().getMass();
    const v = velocity.length();

    // d = (1/2 * mass * v^2) / Force;
    const stoppingDistance =
      this.STOPPING_DISTANCE + (mass * v * v) / (this.BACKWARD_THRUST * 2);

    return stoppingDistance;
  }
}

// ----------------- Auxiliary Functions ---------------------

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