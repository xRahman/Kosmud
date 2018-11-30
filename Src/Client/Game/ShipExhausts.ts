import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { ShipExhaust } from "../../Client/Game/ShipExhaust";
import { ShipAudio } from "../../Client/Flight/ShipAudio";
import { ShipModel } from "../../Client/Flight/ShipModel";

const FRONT_VOLUME = new ZeroToOne(0.1);
const SIDE_VOLUME = new ZeroToOne(0.04);
const REAR_VOLUME = new ZeroToOne(0.2);

const FRONT_EXHAUST_TILEMAP_OBJECT_NAME = "Front exhaust";
const FRONT_LEFT_EXHAUST_TILEMAP_OBJECT_NAME = "Front left exhaust";
const FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME = "Front right exhaust";
const REAR_LEFT_EXHAUST_TILEMAP_OBJECT_NAME = "Rear left exhaust";
const REAR_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME = "Rear right exhaust";
const REAR_EXHAUST_TILEMAP_OBJECT_NAME = "Rear exhaust";

export class ShipExhausts
{
  private readonly front: ShipExhaust;
  private readonly frontLeft: ShipExhaust;
  private readonly frontRight: ShipExhaust;
  private readonly rearLeft: ShipExhaust;
  private readonly rearRight: ShipExhaust;
  private readonly rear: ShipExhaust;

  // ! Throws exception on error.
  constructor(shipModel: ShipModel, shipAudio: ShipAudio)
  {
    const animationName = "Exhaust yellow rectangular Animation";

    // ! Throws exception on error.
    shipModel.createExhaustSpriteAnimation(animationName);

    // ! Throws exception on error.
    this.front = new ShipExhaust
    (
      shipModel, shipAudio, animationName,
      FRONT_EXHAUST_TILEMAP_OBJECT_NAME, FRONT_VOLUME
    );

    // ! Throws exception on error.
    this.frontLeft = new ShipExhaust
    (
      shipModel, shipAudio, animationName,
      FRONT_LEFT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.frontRight = new ShipExhaust
    (
      shipModel, shipAudio, animationName,
      FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.rearLeft = new ShipExhaust
    (
      shipModel, shipAudio, animationName,
      REAR_LEFT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.rearRight = new ShipExhaust
    (
      shipModel, shipAudio, animationName,
      REAR_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.rear = new ShipExhaust
    (
      shipModel, shipAudio, animationName,
      REAR_EXHAUST_TILEMAP_OBJECT_NAME, REAR_VOLUME
    );
  }

  // ---------------- Public methods --------------------

  public update
  (
    forwardThrustRatio: MinusOneToOne,
    leftwardThrustRatio: MinusOneToOne,
    torqueRatio: MinusOneToOne
  )
  {
    const frontExhaustScale = ZeroToOne.clamp(-forwardThrustRatio.value);
    const rearExhaustScale = ZeroToOne.clamp(forwardThrustRatio.value);

    setMinimumExhaustScale(rearExhaustScale, 0.1);

    this.front.update(frontExhaustScale.value);
    this.rear.update(rearExhaustScale.value);

    // Side thrusters get 50% of their length from left-right
    // thrust and another 50% from torque thrust.

    const leftThrustPortion =
      ZeroToOne.clamp(leftwardThrustRatio.value / 2).value;
    const rightThrustPortion =
      ZeroToOne.clamp(-leftwardThrustRatio.value / 2).value;
    const leftTorquePortion =
      ZeroToOne.clamp(torqueRatio.value / 2).value;
    const rightTorquePortion =
      ZeroToOne.clamp(-torqueRatio.value / 2).value;

    this.frontLeft.update(rightThrustPortion + rightTorquePortion);
    this.frontRight.update(leftThrustPortion + leftTorquePortion);
    this.rearLeft.update(rightThrustPortion + leftTorquePortion);
    this.rearRight.update(leftThrustPortion + rightTorquePortion);
  }
}

// ----------------- Auxiliary Functions ---------------------

function setMinimumExhaustScale(thrust: ZeroToOne, minimum: number)
{
  thrust.atLeast(minimum);
}