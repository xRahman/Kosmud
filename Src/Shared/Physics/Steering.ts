/*
  Part of Kosmud

  Steering behavior of autonomous vehicles.
*/

import { intervalBound, normalizeAngle } from "../../Shared/Utils/Math";
import { Vector } from "../../Shared/Physics/Vector";

/// Zatím natvrdo.
const MAX_SPEED = 100;
// const MAXIMUM_STEERING_FORCE = 10;
// const MAXIMUM_STEERING_FORCE_SQUARED =
//   MAXIMUM_STEERING_FORCE * MAXIMUM_STEERING_FORCE;

const FORWARD_THRUST = 50;
const BACKWARD_THRUST = 5;
const STRAFE_THRUST = 5;
const ANGULAR_VELOCITY = Math.PI * 2;
// const ANGULAR_VELOCITY = Math.PI / 2;
// const ANGULAR_ACCELERATION = 4;
// TORQUE asi nahradí angular acceleration.
const TORQUE = 3000;

export namespace Steering
{
  export type Result =
  {
    steeringForce: Vector;
    desiredVelocity: Vector;
    desiredSteeringForce: Vector;
    desiredForwardSteeringForce: Vector;
    desiredLeftwardSteeringForce: Vector;
    angularVelocity: number;
    torque: number;
  };

  // ! Throws exception on error.
  export function seek
  (
    vehiclePosition: Vector,
    vehicleVelocity: Vector,
    targetPosition: Vector,
    vehicleRotation: number,
    vehicleAngularVelocity: number,
    vehicleInertia: number
  )
  : Result
  {
    // Rotation in Box2D can be negative or even greater than 2π.
    // We need to fix that so we can correcly subtract angles.
    const currentRotation = normalizeAngle(vehicleRotation);

    // IDEA: Se shiftem loď strafuje/couvá.

    // IDEA: Desired force rozložit do složek, ty nezávisle capnout a zase
    //   složit.

    // 1. 'desired velocity' = 'target position' - 'vehicle position'.
    const desiredVelocity = Vector.v1MinusV2(targetPosition, vehiclePosition);

    // 2. Scale 'desired velocity' to maximum speed.
    desiredVelocity.setLength(MAX_SPEED);

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

  /// Original code:
  // let steeringForce: Vector;

  // // 4. Limit the magnitude of vector(steering force) to maximum force.
  // if (desiredSteeringForce.lengthSquared() > MAXIMUM_STEERING_FORCE_SQUARED)
  // {
  //   steeringForce = new Vector(desiredSteeringForce).setLength
  //   (
  //     MAXIMUM_STEERING_FORCE
  //   );
  // }
  // else
  // {
  //   steeringForce = new Vector(desiredSteeringForce);
  // }

    // ------------------

    // IDEA: Natáčení do směru udělat podobně jako seek.
    // Tzn:
    // - spočítat desired rotation
    // - aplikovat torque
    // - zpomalovat rotaci, když už se blížím k desired rotation
    // Hmm a asi to fakt zjednoduším a budu počítat a setovat
    // rovnou angular velocity

    // const v1Length = desiredVelocity.length();
    // const v2Length = vehicleVelocity.length();

    // // Desired rotation relative to current bearing.
    // let desiredRotationChange = 0;

    // if (v1Length > 0 && v2Length > 0)
    // {
    //   const v1DotV2 = Vector.v1DotV2(desiredVelocity, vehicleVelocity);
    //   desiredRotationChange = Math.acos(v1DotV2 / (v1Length * v2Length));
    // }

    // Potřebuju opravdu vědět, o kolik se mám otočit?
    // - leda pokud bych se za 1 tik otočil o víc...
    //   Jinak mi stačí prostě točit se maximální rychlostí
    // (možná to můžu prozatím zanedbat a točit se rovnou maximální angular
    //  asi jo, protože za jeden tik se otočím o naprostej prd)

    // // Výsledke vektorového součinu je vektor kolmý na oba vstupní vektory.
    // // Jeho třetí souřadnice je kladná, pokud je úhel mezi vektory kladný
    // // a záporná v opačném případě.
    // //   Třetí souřadnice vektorového součinu se spočítá: u1 * v2 − v1 * u2.
    // const crossZ =
    //   desiredVelocity.x * vehicleVelocity.y
    //   - vehicleVelocity.x * desiredVelocity.y;

    // let angularVelocity: number;

    // if (crossZ === 0)
    // {
    //   angularVelocity = 0;
    // }
    // else if (crossZ > 0)
    // {
    //   angularVelocity = -ANGULAR_VELOCITY;
    // }
    // else
    // {
    //   angularVelocity = ANGULAR_VELOCITY;
    // }

    // ------------------

    // Ok tak ještě jinak (jednodušeji a lépe):
    // - Znám aktuální rotation lodi.
    // - Spočítám desiredRotation
    // - k tomu se budu točit.

    const desiredRotation = desiredVelocity.getRotation();
    let desiredAngularVelocity = desiredRotation - currentRotation;

    if (currentRotation < 0 || currentRotation > Math.PI * 2)
      throw new Error(`'currentRotation' out of bounds: ${currentRotation}`);

    if (desiredRotation < 0 || desiredRotation > Math.PI * 2)
      throw new Error(`'desiredRotation' out of bounds: ${desiredRotation}`);

    /// DEBUG:
    // console.log("Desired velocity:");
    // console.log(desiredVelocity);
    // console.log("Current rotation:");
    // console.log(currentRotation);
    // console.log("Desired rotation:");
    // console.log(desiredRotation);

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

    let  torque = vehicleInertia * (angularVelocity - vehicleAngularVelocity);

    torque = intervalBound(torque, { from: -TORQUE, to: TORQUE });

    /// DEBUG:
    console.log(torque);

    /// Obsolete code (unecessarily complicated).
    // // ! Throws exception on error.
    // // Faster angular breaking - scale interval to a smaller one.
    // angularVelocity = limitToSymmetricInterval
    // (
    //   angularVelocity,
    //   ANGULAR_VELOCITY / 4,
    //   ANGULAR_VELOCITY
    // );

    // ------------------

    /// DEBUG:
    // steeringForce = new Vector();

    // ------------------

    const result =
    {
      steeringForce,
      desiredVelocity,
      desiredSteeringForce,
      desiredForwardSteeringForce,
      desiredLeftwardSteeringForce,
      angularVelocity,
      torque
    };

    return result;

    // // 5. vector(new velocity) =
    // //    vector(current velocity) + vector(steering force)
    // pVehicle.body.velocity.add(vecSteer.x, vecSteer.y);

    // // 6. limit the magnitude of vector(new velocity) to maximum speed
    // if (pVehicle.body.velocity.getMagnitudeSq() > pVehicle.MAX_SPEED_SQ){
    // 	pVehicle.body.velocity.setMagnitude(pVehicle.MAX_SPEED);
    // }

    // // 7. update vehicle rotation according to the angle of the
    // //    vehicle velocity
    // pVehicle.rotation = vecReference.angle(pVehicle.body.velocity)
  }

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

/// This can be done in a much more simpler way
/// (scale by ANGULAR_ACCELERATION first, intervalBound() after that).
// // ! Throws exception on error.
// // This function does two things with 'value':
// //   1. limits it to <-maximumValue, maximumValue>.
// //   2. scales it so it reaches 'maximumValue' (or -maximumValue)
// //      when it would have previously reached 'boundValue'.
// //      (This effectively reduces or increases the rate of it's growth.)
// function limitToSymmetricInterval
// (
//   value: number,
//   boundValue: number,
//   maximumValue: number
// )
// {
//   if (boundValue < 0)
//   {
//     throw new Error(`Invalid 'boundValue' (${boundValue}.`
//       + ` It must be non-negative)`);
//   }

//   if (maximumValue < 0)
//   {
//     throw new Error(`Invalid 'maximumValue' (${maximumValue}.`
//       + ` It must be non-negative)`);
//   }

//   // Lets simplify our task a little bit - interval is symmetrical
//   // so we can work just with absolute value. We will reapply
//   // the sign (which represents direction) at the end.
//   const direction = (value > 0) ? 1 : -1;
//   let absoluteValue = Math.abs(value);

//   if (absoluteValue > maximumValue)
//   {
//     absoluteValue = maximumValue;
//   }

//   if (boundValue === 0)
//   {
//     // If we are to remap to zero-length interval, we just
//     // return the maximum possible value (which is oldBounds)
//     return maximumValue * direction;
//   }

//   const ratio = maximumValue / boundValue;

//   if (absoluteValue < boundValue)
//   {
//     // Scale to the new interval (positive or negative).
//     return absoluteValue * ratio * direction;
//   }
//   else
//   {
//     // Return maximum possible (positive or negative) value.
//     return maximumValue * direction;
//   }
// }