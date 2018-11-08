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
    const vehicleVelocity = this.physicsBody.getVelocity();
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

    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = normalizeAngle(vehicleRotation);
    let desiredRotation = desiredVelocity.getRotation();

    if (distance <= STOPPING_DISTANCE)
    {
      // If we are in final "braking down" phase, pass current
      // rotation as desired rotation to prevent tuning in-place
      // (it doesn't work wery well but it helps a bit).
      desiredRotation = currentRotation;
    }

    this.computeLinearForces
    (
      desiredVelocity,
      vehicleVelocity,
      vehicleRotation
    );

    this.computeAngularForces
    (
      vehicleAngularVelocity,
      vehicleInertia,
      currentRotation,
      desiredRotation
    );
  }

  // ! Throws exception on error.
  protected seek()
  {
    const vehicleVelocity = this.physicsBody.getVelocity();
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

    this.computeLinearForces
    (
      desiredVelocity,
      vehicleVelocity,
      vehicleRotation
    );

    this.computeAngularForces
    (
      vehicleRotation,
      vehicleAngularVelocity,
      vehicleInertia,
      currentRotation
    );
  }

  // ---------------- Private methods -------------------

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
    // console.log("------------------");
    // console.log(forwardLimitRatio);
    // console.log(strafeLimitRatio);
    // console.log(steeringLimitRatio);
    if (steeringLimitRatio < 0 || steeringLimitRatio > 1)
      throw new Error(`Invalid steeringLimitRatio (${steeringLimitRatio})`);

    const steeringForce = Vector.scale
    (
      desiredSteeringForce,
      steeringLimitRatio
    );
    ///

    // 4. Split steeringForce to it's Forward/Backward and Left/Right part.

    /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
    /// ale jednotkový, takže lomeno 1.
    this.forwardThrust = Vector.v1DotV2
    (
      desiredSteeringForce,
      forwardUnitVector
    );

    /// Lomeno velikost vektoru, do kterého se projektujeme. Ten je
    /// ale jednotkový, takže lomeno 1.
    this.leftwardThrust = Vector.v1DotV2
    (
      desiredSteeringForce,
      leftwardUnitVector
    );

    this.desiredVelocity.set(desiredVelocity);
    this.steeringForce.set(steeringForce);
    this.desiredSteeringForce.set(desiredSteeringForce);
    this.desiredForwardSteeringForce.set(desiredForwardSteeringForce);
    this.desiredLeftwardSteeringForce.set(desiredLeftwardSteeringForce);
  }

    // ! Throws exception on error.
  private computeAngularForces
  (
    vehicleAngularVelocity: number,
    vehicleInertia: number,
    currentRotation: number,
    desiredRotation: number
  )
  {
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

    this.torque = torque;
  }
}

// ----------------- Auxiliary Functions ---------------------

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