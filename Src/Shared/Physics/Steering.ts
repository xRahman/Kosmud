/*
  Part of Kosmud

  Steering behavior of autonomous vehicles.
*/

import {Vector} from '../../Shared/Physics/Vector';

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
		// 1. 'desired velocity' = 'target position' - 'vehicle position'.
		let desiredVelocity = Vector.v1MinusV2(targetPosition, vehiclePosition);
		
		// 2. Scale 'desired velocity' to maximum speed.
		desiredVelocity.setLength(MAX_SPEED);
		
    // 3. 'steering force' = 'desired velocity' - 'current velocity'.
    let steeringForce = Vector.v1MinusV2(desiredVelocity, vehicleVelocity);
	
		// 4. limit the magnitude of vector(steering force) to maximum force
    if (steeringForce.lengthSquared() > MAXIMUM_STEERING_FORCE_SQUARED)
    {
      steeringForce.setLength(MAXIMUM_STEERING_FORCE);
    }

    return steeringForce;
		
		// // 5. vector(new velocity) = vector(current velocity) + vector(steering force)
		// pVehicle.body.velocity.add(vecSteer.x, vecSteer.y);
		
		// // 6. limit the magnitude of vector(new velocity) to maximum speed
		// if (pVehicle.body.velocity.getMagnitudeSq() > pVehicle.MAX_SPEED_SQ){
		// 	pVehicle.body.velocity.setMagnitude(pVehicle.MAX_SPEED);
		// }
		
		// // 7. update vehicle rotation according to the angle of the vehicle velocity
		// pVehicle.rotation = vecReference.angle(pVehicle.body.velocity)
  }
}