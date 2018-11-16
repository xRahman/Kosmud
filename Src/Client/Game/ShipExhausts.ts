import { lowerBound } from "../../Shared/Utils/Math";
import { Sound } from "../../Client/Phaser/Sound";
import { Sprite } from "../../Client/Phaser/Sprite";
import { ShipSound } from "../../Client/FlightScene/ShipSound";
import { ShipGraphics } from "../../Client/FlightScene/ShipGraphics";

// const FRONT_SCALE = 1;
// const SIDE_SCALE = 0.4;
// const REAR_SCALE = 2;

const FRONT_VOLUME = 0.1;
const SIDE_VOLUME = 0.04;
const REAR_VOLUME = 0.2;

const FRONT_EXHAUST_TILEMAP_OBJECT = "Front Exhaust";
const FRONT_LEFT_EXHAUST_TILEMAP_OBJECT = "Front Left Exhaust";
const FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT = "Front Right Exhaust";
const REAR_LEFT_EXHAUST_TILEMAP_OBJECT = "Rear Left Exhaust";
const REAR_RIGHT_EXHAUST_TILEMAP_OBJECT = "Rear Right Exhaust";
const REAR_EXHAUST_TILEMAP_OBJECT = "Rear Exhaust";

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
    graphics: ShipGraphics,
    sound: ShipSound
  )
  {
    const animationName = "Exhaust Yellow Rectangular Animation";

    graphics.createExhaustSpriteAnimation(animationName);

    this.front =
    {
      sprites: graphics.createExhaustSprites
      (
        FRONT_EXHAUST_TILEMAP_OBJECT,
        animationName
      ),
      sound: sound.createExhaustSound(FRONT_VOLUME)
    };

    this.frontLeft =
    {
      sprites: graphics.createExhaustSprites
      (
        FRONT_LEFT_EXHAUST_TILEMAP_OBJECT,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.frontRight =
    {
      sprites: graphics.createExhaustSprites
      (
        FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.rearLeft =
    {
      sprites: graphics.createExhaustSprites
      (
        REAR_LEFT_EXHAUST_TILEMAP_OBJECT,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.rearRight =
    {
      sprites: graphics.createExhaustSprites
      (
        REAR_RIGHT_EXHAUST_TILEMAP_OBJECT,
        animationName
      ),
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.rear =
    {
      sprites: graphics.createExhaustSprites
      (
        REAR_EXHAUST_TILEMAP_OBJECT,
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

    // The idea is that side thrusters get 50% of their length from
    // left-right thrust and another 50% from torque thrust
    // (that's probably not matematically correct but it's for display
    //  purposes only).

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
    // sprite.setLengthwiseScale(scale);
  }

  exhaust.sound.setVolume(scale);
}