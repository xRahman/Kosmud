import { lowerBound } from "../../Shared/Utils/Math";
import { Sound } from "../../Client/Phaser/Sound";
import { Sprite } from "../../Client/Phaser/Sprite";
import { ShipSound } from "../../Client/FlightScene/ShipSound";
import { ShipGraphics } from "../../Client/FlightScene/ShipGraphics";

const FRONT_SCALE = 1;
const SIDE_SCALE = 0.4;
const REAR_SCALE = 2;

const FRONT_VOLUME = 0.1;
const SIDE_VOLUME = 0.04;
const REAR_VOLUME = 0.2;

type Exhaust =
{
  sprites: Array<Sprite>;
  sound: Sound;
};

export class ShipExhausts
{
  private readonly front: Exhaust;
  private readonly frontLeft: Exhaust;
  private readonly backLeft: Exhaust;
  private readonly frontRight: Exhaust;
  private readonly backRight: Exhaust;
  private readonly rear: Exhaust;

  constructor
  (
    graphics: ShipGraphics,
    sound: ShipSound
  )
  {
    this.front =
    {
      sprites:
      [
        graphics.createExhaustSprite("0", 120, -65, -Math.PI / 2, FRONT_SCALE),
        graphics.createExhaustSprite("1", 120, 65, -Math.PI / 2, FRONT_SCALE)
      ],
      sound: sound.createExhaustSound(FRONT_VOLUME)
    };

    this.frontLeft =
    {
      sprites:
      [
        graphics.createExhaustSprite("2", 100, -67, Math.PI, SIDE_SCALE)
      ],
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.backLeft =
    {
      sprites:
      [
        graphics.createExhaustSprite("3", -95, -120, Math.PI, SIDE_SCALE)
      ],
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.frontRight =
    {
      sprites:
      [
        graphics.createExhaustSprite("4", 100, 67, 0, SIDE_SCALE)
      ],
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.backRight =
    {
      sprites:
      [
        graphics.createExhaustSprite("5", -95, 120, 0, SIDE_SCALE)
      ],
      sound: sound.createExhaustSound(SIDE_VOLUME)
    };

    this.rear =
    {
      sprites:
      [
        graphics.createExhaustSprite("6", -190, -50, Math.PI / 2, REAR_SCALE),
        graphics.createExhaustSprite("7", -190, 50, Math.PI / 2, REAR_SCALE)
      ],
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
      this.backLeft,
      lowerBound(leftwardThrustRatio / 2, 0) + lowerBound(torqueRatio / 2, 0)
    );

    updateExhaust
    (
      this.backRight,
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
    sprite.setScaleY(scale);
  }

  exhaust.sound.setVolume(scale);
}