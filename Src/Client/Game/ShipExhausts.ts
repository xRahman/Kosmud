import { lowerBound } from "../../Shared/Utils/Math";
import { Sound } from "../../Client/Engine/Sound";
import { Sprite } from "../../Client/Engine/Sprite";
import { ShipSound } from "../../Client/FlightScene/ShipSound";
import { ShipModel } from "../../Client/FlightScene/ShipModel";

const FRONT_VOLUME = 0.1;
const SIDE_VOLUME = 0.04;
const REAR_VOLUME = 0.2;

const FRONT_EXHAUST_TILEMAP_OBJECT_NAME = "Front exhaust";
const FRONT_LEFT_EXHAUST_TILEMAP_OBJECT_NAME = "Front left exhaust";
const FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME = "Front right exhaust";
const REAR_LEFT_EXHAUST_TILEMAP_OBJECT_NAME = "Rear left exhaust";
const REAR_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME = "Rear right exhaust";
const REAR_EXHAUST_TILEMAP_OBJECT_NAME = "Rear exhaust";

type Exhaust =
{
  sprites: Array<Sprite>;
  sound: Sound;
};

export class ShipExhausts
{
  private readonly front: Exhaust;
  private readonly frontLeft: Exhaust;
  private readonly frontRight: Exhaust;
  private readonly rearLeft: Exhaust;
  private readonly rearRight: Exhaust;
  private readonly rear: Exhaust;

  // ! Throws exception on error.
  constructor
  (
    graphics: ShipModel,
    sound: ShipSound
  )
  {
    const animationName = "Exhaust yellow rectangular Animation";

    // ! Throws exception on error.
    graphics.createExhaustSpriteAnimation(animationName);

    this.front =
    {
      // ! Throws exception on error.
      sprites: graphics.createExhaustSprites
      (
        FRONT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: sound.createExhaustSound(FRONT_VOLUME)
    };

    this.frontLeft =
    {
      // ! Throws exception on error.
      sprites: graphics.createExhaustSprites
      (
        FRONT_LEFT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.frontRight =
    {
      // ! Throws exception on error.
      sprites: graphics.createExhaustSprites
      (
        FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.rearLeft =
    {
      // ! Throws exception on error.
      sprites: graphics.createExhaustSprites
      (
        REAR_LEFT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.rearRight =
    {
      // ! Throws exception on error.
      sprites: graphics.createExhaustSprites
      (
        REAR_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.rear =
    {
      // ! Throws exception on error.
      sprites: graphics.createExhaustSprites
      (
        REAR_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: sound.createExhaustSound(REAR_VOLUME)
    };
  }

  // ---------------- Public methods --------------------

  public update
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    updateExhaust(this.front, lowerBound(-forwardThrustRatio, 0));

    // Side thrusters get 50% of their length from left-right
    // thrust and another 50% from torque thrust.

    updateExhaust
    (
      this.frontLeft,
      lowerBound(leftwardThrustRatio / 2, 0) + lowerBound(-torqueRatio / 2, 0)
    );

    updateExhaust
    (
      this.frontRight,
      lowerBound(-leftwardThrustRatio / 2, 0) + lowerBound(torqueRatio / 2, 0)
    );

    updateExhaust
    (
      this.rearLeft,
      lowerBound(leftwardThrustRatio / 2, 0) + lowerBound(torqueRatio / 2, 0)
    );

    updateExhaust
    (
      this.rearRight,
      lowerBound(-leftwardThrustRatio / 2, 0) + lowerBound(-torqueRatio / 2, 0)
    );

    updateExhaust(this.rear, lowerBound(forwardThrustRatio, 0.05));
  }
}

// ----------------- Auxiliary Functions ---------------------

function updateExhaust(exhaust: Exhaust, scale: number)
{
  for (const sprite of exhaust.sprites)
  {
    sprite.setScaleX(scale);
  }

  exhaust.sound.setVolume(scale);
}