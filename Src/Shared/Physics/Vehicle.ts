/*
  Part of Kosmud

  Steering behavior of autonomous vehicles.
*/

import { intervalBound, normalizeAngle } from "../../Shared/Utils/Math";
import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsWorld } from "./PhysicsWorld";

/// Zatím natvrdo.
const MAX_SPEED = 200;
// const MAXIMUM_STEERING_FORCE = 10;
// const MAXIMUM_STEERING_FORCE_SQUARED =
//   MAXIMUM_STEERING_FORCE * MAXIMUM_STEERING_FORCE;

const FORWARD_THRUST = 100;
const BACKWARD_THRUST = 20;
const STRAFE_THRUST = 5;
const ANGULAR_VELOCITY = Math.PI * 2;
// const ANGULAR_VELOCITY = Math.PI / 2;
// const ANGULAR_ACCELERATION = 4;
// TORQUE asi nahradí angular acceleration.
const TORQUE = 3000;

const FPS = 60;

const STOPPING_DISTANCE = 20;
const STOPPING_SPEED = MAX_SPEED / 100;

type LinearForces =
{
  steeringForce: Vector;
  desiredVelocity: Vector;
  desiredSteeringForce: Vector;
  desiredForwardSteeringForce: Vector;
  desiredLeftwardSteeringForce: Vector;
};

type AngularForces =
{
  torque: number;
};

type SteeringResult =
{
  linear: LinearForces;
  angular: AngularForces;
};

export class Vehicle
{
  protected readonly waypoint = new Vector();
  protected readonly velocity = new Vector();
  protected readonly desiredVelocity = new Vector();
  protected readonly steeringForce = new Vector();
  protected readonly desiredSteeringForce = new Vector();
  protected readonly desiredForwardSteeringForce = new Vector();
  protected readonly desiredLeftwardSteeringForce = new Vector();
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
  public getVelocity() { return this.velocity; }

  // tslint:disable-next-line:prefer-function-over-method
  public getForwardThrustRatio()
  {
    /// TODO.
    return 0;
  }
  // tslint:disable-next-line:prefer-function-over-method
  public getLeftwardThrustRatio()
  {
    /// TODO.
    return 0;
  }
  // tslint:disable-next-line:prefer-function-over-method
  public getTorqueRatio()
  {
    /// TODO.
    return 0;
    // return this.torque / Ship.maximumTorque;
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
    /// DEBUG:
    // console.log("Steering to position"
    //   + " [" + this.targetPosition.x + ", " + this.targetPosition.y + "]");

    const vehicleVelocity = this.physicsBody.getVelocity();

    const steeringResult = this.arrive(vehicleVelocity);

    // const steeringResult = Steering.seek
    // (
    //   this.getPosition(),
    //   vehicleVelocity,
    //   this.waypoint,
    //   this.physicsBody.getRotation(),
    //   this.physicsBody.getAngularVelocity(),
    //   this.physicsBody.getInertia(),
    // );

    /// DEBUG:
    // console.log("Applying steering force"
    //   + " [" + steeringForce.x + ", " + steeringForce.y + "]");

    this.desiredVelocity.set(steeringResult.linear.desiredVelocity);
    this.steeringForce.set(steeringResult.linear.steeringForce);
    this.desiredSteeringForce.set(steeringResult.linear.desiredSteeringForce);
    this.desiredForwardSteeringForce.set
    (
      steeringResult.linear.desiredForwardSteeringForce
    );
    this.desiredLeftwardSteeringForce.set
    (
      steeringResult.linear.desiredLeftwardSteeringForce
    );
    this.velocity.set(vehicleVelocity);
    this.torque = steeringResult.angular.torque;

    this.physicsBody.applyForce(this.steeringForce);
    // this.physicsBody.setAngularVelocity(steeringResult.angularVelocity);
    this.physicsBody.applyTorque(this.torque);
  }

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  protected arrive(vehicleVelocity: Vector): SteeringResult
  {
    const vehiclePosition = this.getPosition();
    const vehicleMass = this.physicsBody.getMass();
    const targetPosition = this.waypoint;
    const vehicleRotation = this.physicsBody.getRotation();
    const vehicleAngularVelocity = this.physicsBody.getAngularVelocity();
    const vehicleInertia = this.physicsBody.getInertia();

    // 1. Calculate breaking distance.
    // d = (1/2 * m * v^2) / Force;
    const v = vehicleVelocity.length();
    const brakingDistance = STOPPING_DISTANCE
      + (vehicleMass * v * v) / (BACKWARD_THRUST * 2);

    // 1. 'desired velocity' = 'target position' - 'vehicle position'.
    const desiredVelocity = Vector.v1MinusV2(targetPosition, vehiclePosition);
    const distance = desiredVelocity.length();

    if (distance > brakingDistance)
    {
      // 2. Scale 'desired velocity' to maximum speed.
      desiredVelocity.setLength(MAX_SPEED);
    }
    else if (distance > STOPPING_DISTANCE)
    {
      // console.log("braking...");

      // Graduální zpomalování je hezké, ale asi blbě - zabrzdit chci
      // co nejrychlejš, ne pozvolně.
      /// - Možná bych to ale mohl zas udělat nějak tak, že úplně na konci
      /// se dobrzdí pozvolně.
      // if (brakingDistance <= Number.EPSILON)
      //   desiredVelocity.setLength(0);
      // else
      //   desiredVelocity.setLength(MAX_SPEED * distance / brakingDistance);

      /// Shodit velocity úplně na 0 asi není dobrej nápad, protože tím přijdu
      /// o směr.
      // desiredVelocity.setLength(Number.EPSILON);
      desiredVelocity.setLength(STOPPING_SPEED);
    }
    else
    {
      // console.log("stopping...");

      // Na posledních 10 metrech gradual approach.
      if (brakingDistance <= 1)
      {
        desiredVelocity.setLength(0);
      }
      else
      {
        desiredVelocity.setLength
        (
          STOPPING_SPEED * distance / STOPPING_DISTANCE
        );
      }
    }

    /// FIXME: Tohle jsem nějak strašně nahackoval.
    /// (smysl je, passnout currentRotation stejnou jako desiredRotation,
    ///  abych se netočil na místě.)
    const currentRotation = (distance > STOPPING_DISTANCE) ?
      // Rotation in Box2D can be negative or even greater than 2π.
      // We need to fix that so we can correcly subtract angles.
      normalizeAngle(vehicleRotation) : desiredVelocity.getRotation();

    const result: SteeringResult =
    {
      linear: computeLinearForces
      (
        desiredVelocity,
        vehicleVelocity,
        vehicleRotation
      ),
      angular: computeAngularForces
      (
        desiredVelocity,
        vehicleRotation,
        vehicleAngularVelocity,
        vehicleInertia,
        currentRotation
      )
    };

    return result;
  }

  // ! Throws exception on error.
  protected seek(vehicleVelocity: Vector): SteeringResult
  {
    const vehiclePosition = this.getPosition();
    const targetPosition = this.waypoint;
    const vehicleRotation = this.getRotation();
    const vehicleAngularVelocity = this.physicsBody.getAngularVelocity();
    const vehicleInertia = this.physicsBody.getInertia();

    // 1. 'desired velocity' = 'target position' - 'vehicle position'.
    const desiredVelocity = Vector.v1MinusV2(targetPosition, vehiclePosition);

    // 2. Scale 'desired velocity' to maximum speed.
    desiredVelocity.setLength(MAX_SPEED);

    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = normalizeAngle(vehicleRotation);

    const result: SteeringResult =
    {
      linear: computeLinearForces
      (
        desiredVelocity,
        vehicleVelocity,
        vehicleRotation
      ),
      angular: computeAngularForces
      (
        desiredVelocity,
        vehicleRotation,
        vehicleAngularVelocity,
        vehicleInertia,
        currentRotation
      )
    };

    return result;
  }

  // ---------------- Private methods -------------------

// export function seek
// (
//   vehiclePosition: Vector,
//   vehicleVelocity: Vector,
//   targetPosition: Vector
// )
// : Result
// {
//   // 1. 'desired velocity' = 'target position' - 'vehicle position'.
//   const desiredVelocity = Vector.v1MinusV2(targetPosition, vehiclePosition);

//   // 2. Scale 'desired velocity' to maximum speed.
//   desiredVelocity.setLength(MAX_SPEED);

//   // 3. 'steering force' = 'desired velocity' - 'current velocity'.
//   const desiredSteeringForce = Vector.v1MinusV2
//   (
//     desiredVelocity,
//     vehicleVelocity
//   );

//   let steeringForce: Vector;

//   // 4. Limit the magnitude of vector(steering force) to maximum force.
//   if (desiredSteeringForce.lengthSquared() > MAXIMUM_STEERING_FORCE_SQUARED)
//   {
//     steeringForce = new Vector(desiredSteeringForce).setLength
//     (
//       MAXIMUM_STEERING_FORCE
//     );
//   }
//   else
//   {
//     steeringForce = new Vector(desiredSteeringForce);
//   }

//   return { steeringForce, desiredVelocity, desiredSteeringForce };

//   // // 5. vector(new velocity) =
//   // //    vector(current velocity) + vector(steering force)
//   // pVehicle.body.velocity.add(vecSteer.x, vecSteer.y);

//   // // 6. limit the magnitude of vector(new velocity) to maximum speed
//   // if (pVehicle.body.velocity.getMagnitudeSq() > pVehicle.MAX_SPEED_SQ){
//   // 	pVehicle.body.velocity.setMagnitude(pVehicle.MAX_SPEED);
//   // }

//   // // 7. update vehicle rotation according to the angle of the
//   // //    vehicle velocity
//   // pVehicle.rotation = vecReference.angle(pVehicle.body.velocity)
// }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function computeLinearForces
(
  desiredVelocity: Vector,
  vehicleVelocity: Vector,
  vehicleRotation: number,
)
: LinearForces
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

  // 3.5 Split desiredSteeringForce to it's Forward/Barkward and
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
  // console.log("------------------");
  // console.log(forwardLimitRatio);
  // console.log(strafeLimitRatio);
  // console.log(steeringLimitRatio);
  if (steeringLimitRatio < 0 || steeringLimitRatio > 1)
    throw new Error(`Invalid steeringLimitRatio (${steeringLimitRatio})`);
  ///

  // const forwardForceMagnitude = intervalBound
  // (
  //   desiredForwardComponentMagnitude,
  //   { from: -BACKWARD_THRUST, to: FORWARD_THRUST }
  // );

  // const leftwardForceMagnitude = intervalBound
  // (
  //   desiredLeftwardComponentMagnitude,
  //   { from: -STRAFE_THRUST, to: STRAFE_THRUST }
  // );

  // const forwardSteeringForce = Vector.scale
  // (
  //   forwardUnitVector,
  //   forwardForceMagnitude
  // );

  // const leftwardSteeringForce = Vector.scale
  // (
  //   leftwardUnitVector,
  //   leftwardForceMagnitude
  // );

  /// Původně (nezávislý limit na forward a leftward složky).
  // const steeringForce = new Vector(forwardSteeringForce);
  // const steeringForce = Vector.v1PlusV2
  // (
  //   forwardSteeringForce,
  //   leftwardSteeringForce
  // );
  /// Nově:
  const steeringForce = Vector.scale
  (
    desiredSteeringForce,
    steeringLimitRatio
  );
  ///

  const result =
  {
    steeringForce,
    desiredVelocity,
    desiredSteeringForce,
    desiredForwardSteeringForce,
    desiredLeftwardSteeringForce
  };

  return result;
}

// ! Throws exception on error.
function computeAngularForces
(
  desiredVelocity: Vector,
  vehicleRotation: number,
  vehicleAngularVelocity: number,
  vehicleInertia: number,
  currentRotation: number
)
: AngularForces
{
  const desiredRotation = desiredVelocity.getRotation();
  let desiredAngularVelocity = desiredRotation - currentRotation;

  if (currentRotation < 0 || currentRotation > Math.PI * 2)
    throw new Error(`'currentRotation' out of bounds: ${currentRotation}`);

  if (desiredRotation < 0 || desiredRotation > Math.PI * 2)
    throw new Error(`'desiredRotation' out of bounds: ${desiredRotation}`);

  // Make sure that we turn the shorter way.
  if (desiredAngularVelocity > Math.PI)
    desiredAngularVelocity -= Math.PI * 2;
  if (desiredAngularVelocity < -Math.PI)
    desiredAngularVelocity += Math.PI * 2;

  // // Limit to ANGULAR_VELOCITY.
  // const angularVelocity = intervalBound
  // (
  //   // Apply the angular acceleration first.
  //   desiredAngularVelocity * ANGULAR_ACCELERATION,
  //   { from: -ANGULAR_VELOCITY, to: ANGULAR_VELOCITY }
  // );

  // Limit to ANGULAR_VELOCITY.
  const angularVelocity = intervalBound
  (
    desiredAngularVelocity,
    { from: -ANGULAR_VELOCITY, to: ANGULAR_VELOCITY }
  );

  let torque = vehicleInertia * (angularVelocity - vehicleAngularVelocity);

  // This prevents overturnign the desired angle
  // (and it probably should be here according to Box2D example).
  torque *= FPS;

  torque = intervalBound(torque, { from: -TORQUE, to: TORQUE });

  return { torque };
}