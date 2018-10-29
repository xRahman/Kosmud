/*
  Part of Kosmud

  Steering behavior of autonomous vehicles.
*/

import { Vector } from "../../Shared/Physics/Vector";

/// Zatím natvrdo.
const MAX_SPEED = 100;
const MAXIMUM_STEERING_FORCE = 10;
const MAXIMUM_STEERING_FORCE_SQUARED =
  MAXIMUM_STEERING_FORCE * MAXIMUM_STEERING_FORCE;

const FORWARD_THRUST = 20;
const BARKWARD_THRUST = 10;
const STRAFE_THRUST = 5;
// const MAXIMUM_ANGULAR_VELOCITY = Math.PI / 20;
const ANGULAR_VELOCITY = Math.PI / 20;

function lowerBound(value: number, bound: number)
{
  return Math.max(value, bound);
}

function upperBound(value: number, bound: number)
{
  return Math.min(value, bound);
}

function intervalBound
(
  value: number,
  { from, to }: { from: number; to: number }
)
{
  return Math.min(Math.max(value, from), to);
}

export namespace Steering
{
  export type Result =
  {
    steeringForce: Vector;
    desiredVelocity: Vector;
    desiredSteeringForce: Vector;
    angularVelocity: number;
  };

  export function seek
  (
    vehiclePosition: Vector,
    vehicleVelocity: Vector,
    targetPosition: Vector,
    currentRotation: number
  )
  : Result
  {
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

    let steeringForce: Vector;

    // 4. Limit the magnitude of vector(steering force) to maximum force.
    if (desiredSteeringForce.lengthSquared() > MAXIMUM_STEERING_FORCE_SQUARED)
    {
      steeringForce = new Vector(desiredSteeringForce).setLength
      (
        MAXIMUM_STEERING_FORCE
      );
    }
    else
    {
      steeringForce = new Vector(desiredSteeringForce);
    }

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

    //

    // des 350
    // cur 10
    // ------
    // -20

    // des - cur = 340, -360 = -20

    const desiredRotation = desiredVelocity.getRotation();
    let desiredAngularVelocity = desiredRotation - currentRotation;

    /// DEBUG:
    // console.log("Desired velocity:");
    // console.log(desiredVelocity);
    // console.log("Current rotation:");
    // console.log(currentRotation);
    // console.log("Desired rotation:");
    // console.log(desiredRotation);

    // Make sure that we make a turn the shorter way.
    if (desiredAngularVelocity > Math.PI)
      desiredAngularVelocity -= Math.PI * 2;

    /// Tímhle jsem vlastně ale nevyřešil zastavení na požadovaném směru
    /// (leda bych se na něm zastavil náhodou), protože angular velocity je
    /// "za sekundu", ne za tik.
    /// - i když možná vyřešil - angularVelocity by se měla při přibližování
    ///  snižovat... Každopádně to nefunguje.

    /// Proč se mi to po dosažení směru přetáčí?
    /// - no, angularVelocity je buď +max nebo -max

    // Limit to ANGULAR_VELOCITY.
    const angularVelocity = intervalBound
    (
      desiredAngularVelocity,
      {
        from: -ANGULAR_VELOCITY,
        to: ANGULAR_VELOCITY
      }
    );

    // ------------------

    /// DEBUG:
    // steeringForce = new Vector();

    // ------------------

    const result =
    {
      steeringForce,
      desiredVelocity,
      desiredSteeringForce,
      angularVelocity
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