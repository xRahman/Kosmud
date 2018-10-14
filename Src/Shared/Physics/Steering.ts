/*
  Part of Kosmud

  Steering behavior of autonomous vehicles.
*/

import {b2Vec2} from '../../Shared/Box2D/Box2D';

type Vector = { x: number, y: number };

/// Zatím natvrdo.
const MAX_SPEED = 100;
const MAXIMUM_STEERING_FORCE = 10;
const MAXIMUM_STEERING_FORCE_SQUARED =
  MAXIMUM_STEERING_FORCE * MAXIMUM_STEERING_FORCE;

export class Steering
{
  public static seek
  (
    vehiclePosition: Vector,
    vehicleVelocity: Vector,
    targetPosition: Vector
  )
  {
    let desiredVelocity = new b2Vec2(targetPosition.x, targetPosition.y);
		
		// 1. (desired velocity) = (target position) - (vehicle position).
		desiredVelocity = desiredVelocity.SelfSub(vehiclePosition);
		
		// 2. normalize (desired velocity).
		desiredVelocity.SelfNormalize();
		
		// 3. scale (desired velocity) to maximum speed.
		desiredVelocity.SelfMul(MAX_SPEED);
		
    // 4. vector(steering force) = vector(desired velocity) - vector(current velocity)
    let steeringForce = desiredVelocity.Clone();

    steeringForce.SelfSub(vehicleVelocity);

		
		// 5. limit the magnitude of vector(steering force) to maximum force
    if (steeringForce.LengthSquared() > MAXIMUM_STEERING_FORCE_SQUARED)
    {
      steeringForce.SelfNormalize();
      steeringForce.SelfMul(MAXIMUM_STEERING_FORCE);
    }

    return steeringForce;
		
		// // 6. vector(new velocity) = vector(current velocity) + vector(steering force)
		// pVehicle.body.velocity.add(vecSteer.x, vecSteer.y);
		
		// // 7. limit the magnitude of vector(new velocity) to maximum speed
		// if (pVehicle.body.velocity.getMagnitudeSq() > pVehicle.MAX_SPEED_SQ){
		// 	pVehicle.body.velocity.setMagnitude(pVehicle.MAX_SPEED);
		// }
		
		// // 8. update vehicle rotation according to the angle of the vehicle velocity
		// pVehicle.rotation = vecReference.angle(pVehicle.body.velocity)
  }
}