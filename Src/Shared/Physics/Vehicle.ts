/*
  Part of Kosmud

  Steering behavior of autonomous vehicles.
*/

import { intervalBound, normalizeAngle } from "../../Shared/Utils/Math";
import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsWorld } from "./PhysicsWorld";

/// Zatím natvrdo.
const MAX_SPEED = 200;
const FORWARD_THRUST = 100;
const BACKWARD_THRUST = 20;
const STRAFE_THRUST = 5;
const ANGULAR_VELOCITY = Math.PI * 2;
const TORQUE = 3000;

const FPS = 60;

const STOPPING_DISTANCE = 20;
const STOPPING_SPEED = MAX_SPEED / 100;

export class Vehicle
{
  protected readonly waypoint = new Vector();
  protected readonly desiredVelocity = new Vector();
  protected readonly steeringForce = new Vector();
  protected readonly forwardSteeringForce = new Vector();
  protected readonly leftwardSteeringForce = new Vector();
  protected readonly desiredSteeringForce = new Vector();
  protected readonly desiredForwardSteeringForce = new Vector();
  protected readonly desiredLeftwardSteeringForce = new Vector();
  protected forwardThrust = 0;
  protected leftwardThrust = 0;
  protected torque = 0;

  private readonly physicsBody = PhysicsWorld.createBody();

  constructor()
  {
    this.waypoint.set(this.physicsBody.getPosition());
  }

  // ---------------- Public methods --------------------

  public getPosition() {  return this.physicsBody.getPosition(); }

  public getX() { return this.physicsBody.getX(); }
  public getY() { return this.physicsBody.getY(); }
  public getRotation() { return this.physicsBody.getRotation(); }

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
  public getVelocity() { return this.physicsBody.getVelocity(); }

  public getForwardThrustRatio()
  {
    if (this.forwardThrust >= 0)
      return this.forwardThrust / FORWARD_THRUST;
    else
      return this.forwardThrust / BACKWARD_THRUST;
  }

  public getLeftwardThrustRatio()
  {
    return this.leftwardThrust / STRAFE_THRUST;
  }

  public getTorqueRatio()
  {
    return this.torque / TORQUE;
  }

  public setWaypoint(waypoint: Vector)
  {
    this.waypoint.set(waypoint);
  }

  /// TODO: Tohle časem zrušit (mělo by se používat jen applyForce()).
  public setAngularVelocity(angularVelocity: number)
  {
    this.physicsBody.setAngularVelocity(angularVelocity);
  }

  /// TODO: Tohle časem zrušit (mělo by se používat jen applyForce()).
  public setVelocity(velocity: number)
  {
    this.physicsBody.setVelocity(velocity);
  }

  /// TODO: Tohle časem zrušit (mělo by se používat jen applyForce()).
  public updateVelocityDirection()
  {
    this.physicsBody.updateVelocityDirection();
  }

  public getShape()
  {
    return this.physicsBody.getShape();
  }

  public steer()
  {
    this.arrive();

    // this.seek();

    this.physicsBody.applyForce(this.steeringForce);
    this.physicsBody.applyTorque(this.torque);
  }

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  protected arrive()
  {
    const vehiclePosition = this.getPosition();
    const targetPosition = this.waypoint;
    const oldVelocity = this.physicsBody.getVelocity();
    const vehicleRotation = this.physicsBody.getRotation();

    const targetVector = Vector.v1MinusV2(targetPosition, vehiclePosition);
    const distance = targetVector.length();

    const brakingDistance = this.computeBrakingDistance(oldVelocity);
    const desiredVelocity = new Vector(targetVector);

    let rotationFlip = 0;

    if (distance > brakingDistance)
    {
      // Same as 'seek' behaviour (scale 'desired velocity' to maximum speed).
      desiredVelocity.setLength(MAX_SPEED);

      rotationFlip = 0;
    }
    else if (distance > STOPPING_DISTANCE)
    {
      rotationFlip = Math.PI;

      // Break almost to zero velocity
      // (zero velocity is not a good idea because zero vector
      //  has undefined direction).
      desiredVelocity.setLength(STOPPING_SPEED);
    }
    else if (distance > 1)
    {
      // console.log("stopping...");

      rotationFlip = Math.PI;
      // Use gradual approach at STOPPING_DISTANCE.
      desiredVelocity.setLength
      (
        STOPPING_SPEED * distance / STOPPING_DISTANCE
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
    const currentRotation = normalizeAngle(vehicleRotation);

    /// Zkusím se točit k desiredSteeringForce místo k desiredRotation.
    // let desiredRotation = desiredVelocity.getRotation();
    let desiredRotation = normalizeAngle
    (
      /// 'rotationFlip' je 0 při zrychlování a PI při zpomalování,
      /// protože při brždění musí čumák koukat na opačnou stranu než
      /// kam směřuje desiredSteeringForce.
      this.desiredSteeringForce.getRotation() + rotationFlip
    );

    if (distance <= STOPPING_DISTANCE)
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
    const vehicleVelocity = this.physicsBody.getVelocity();
    const vehiclePosition = this.getPosition();
    const targetPosition = this.waypoint;
    const vehicleRotation = this.getRotation();

    // 1. 'desired velocity' = 'target position' - 'vehicle position'.
    const desiredVelocity = Vector.v1MinusV2(targetPosition, vehiclePosition);

    // 2. Scale 'desired velocity' to maximum speed.
    desiredVelocity.setLength(MAX_SPEED);

    this.computeLinearForces
    (
      desiredVelocity,
      vehicleVelocity,
      vehicleRotation
    );

    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = normalizeAngle(vehicleRotation);
    const desiredRotation = desiredVelocity.getRotation();

    this.computeAngularForces(currentRotation, desiredRotation);
  }

  // ---------------- Private methods -------------------

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
    const currentRotation = normalizeAngle(vehicleRotation);

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

    const leftwardRotation = normalizeAngle(currentRotation + Math.PI / 2);
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
    if (desiredForwardComponentMagnitude > FORWARD_THRUST)
    {
      forwardLimitRatio = FORWARD_THRUST / desiredForwardComponentMagnitude;
    }
    else if (desiredForwardComponentMagnitude < -BACKWARD_THRUST)
    {
      forwardLimitRatio = -BACKWARD_THRUST / desiredForwardComponentMagnitude;
    }
    let strafeLimitRatio = 1;
    if (desiredLeftwardComponentMagnitude > STRAFE_THRUST)
    {
      strafeLimitRatio = STRAFE_THRUST / desiredLeftwardComponentMagnitude;
    }
    else if (desiredLeftwardComponentMagnitude < -STRAFE_THRUST)
    {
      strafeLimitRatio = -STRAFE_THRUST / desiredLeftwardComponentMagnitude;
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
    const oldAngularVelocity = this.physicsBody.getAngularVelocity();

    if (currentRotation < 0 || currentRotation > Math.PI * 2)
      throw new Error(`'currentRotation' out of bounds: ${currentRotation}`);

    if (desiredRotation < 0 || desiredRotation > Math.PI * 2)
      throw new Error(`'desiredRotation' out of bounds: ${desiredRotation}`);

    const inertia = this.physicsBody.getInertia();

    const desiredAngularVelocity = computeDesiredAngularVelocity
    (
      desiredRotation, currentRotation
    );

    const newAngularVelocity = intervalBound
    (
      desiredAngularVelocity,
      { from: -ANGULAR_VELOCITY, to: ANGULAR_VELOCITY }
    );

    // Multiplication by 'FPS' prevents overturning the desired angle
    // (as suggested by Box2D example).
    let torque = inertia * (newAngularVelocity - oldAngularVelocity) * FPS;

    torque = intervalBound(torque, { from: -TORQUE, to: TORQUE });

    this.torque = torque;
  }

  private computeBrakingDistance(velocity: Vector)
  {
    const mass = this.physicsBody.getMass();
    const v = velocity.length();

    // d = (1/2 * mass * v^2) / Force;
    return STOPPING_DISTANCE + (mass * v * v) / (BACKWARD_THRUST * 2);
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