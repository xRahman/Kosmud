import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { Sound } from "../../Client/Engine/Sound";
import { Sprite } from "../../Client/Engine/Sprite";
import { ShipAudio } from "../../Client/Flight/ShipAudio";
import { ShipModel } from "../../Client/Flight/ShipModel";

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
  constructor(model: ShipModel, audio: ShipAudio)
  {
    const animationName = "Exhaust yellow rectangular Animation";

    // ! Throws exception on error.
    model.createExhaustSpriteAnimation(animationName);

    this.front =
    {
      // ! Throws exception on error.
      sprites: model.createExhaustSprites
      (
        FRONT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: audio.createExhaustSound(FRONT_VOLUME)
    };

    this.frontLeft =
    {
      // ! Throws exception on error.
      sprites: model.createExhaustSprites
      (
        FRONT_LEFT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: audio.createExhaustSound(SIDE_VOLUME)
    };

    this.frontRight =
    {
      // ! Throws exception on error.
      sprites: model.createExhaustSprites
      (
        FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: audio.createExhaustSound(SIDE_VOLUME)
    };

    this.rearLeft =
    {
      // ! Throws exception on error.
      sprites: model.createExhaustSprites
      (
        REAR_LEFT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: audio.createExhaustSound(SIDE_VOLUME)
    };

    this.rearRight =
    {
      // ! Throws exception on error.
      sprites: model.createExhaustSprites
      (
        REAR_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: audio.createExhaustSound(SIDE_VOLUME)
    };

    this.rear =
    {
      // ! Throws exception on error.
      sprites: model.createExhaustSprites
      (
        REAR_EXHAUST_TILEMAP_OBJECT_NAME,
        animationName
      ),
      sound: audio.createExhaustSound(REAR_VOLUME)
    };
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

    updateExhaust(this.front, frontExhaustScale);
    updateExhaust(this.rear, rearExhaustScale);

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

    updateExhaust
    (
      this.frontLeft,
      new ZeroToOne(rightThrustPortion + rightTorquePortion)
    );

    updateExhaust
    (
      this.frontRight,
      new ZeroToOne(leftThrustPortion + leftTorquePortion)
    );

    updateExhaust
    (
      this.rearLeft,
      new ZeroToOne(rightThrustPortion + leftTorquePortion)
    );

    updateExhaust
    (
      this.rearRight,
      new ZeroToOne(leftThrustPortion + rightTorquePortion)
    );
  }
}

// ----------------- Auxiliary Functions ---------------------

function setMinimumExhaustScale(thrust: ZeroToOne, minimum: number)
{
  thrust.atLeast(minimum);
}

function updateExhaust(exhaust: Exhaust, scale: ZeroToOne)
{
  for (const sprite of exhaust.sprites)
  {
    if (scale.value <= 0.01)
    {
      sprite.hide();
    }
    else
    {
      sprite.show();

      sprite.setScaleX(scale.value);
    }
  }

  exhaust.sound.setVolume(scale.value);
}