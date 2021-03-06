/*  Part of Kosmud  */

// import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { ExhaustModel } from "../../Client/Flight/ExhaustModel";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { TilemapAsset } from "../../Client/Asset/TilemapAsset";
import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";
import { SoundAsset } from "../../Client/Asset/SoundAsset";
import { SpriteAnimation } from "../Engine/SpriteAnimation";
import { NonnegativeNumber } from "../../Shared/Utils/NonnegativeNumber";

const EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID =
  "Exhaust yellow rectangular Texture atlas";

const FRONT_VOLUME = new ZeroToOne(0.1);
const SIDE_VOLUME = new ZeroToOne(0.04);
const REAR_VOLUME = new ZeroToOne(0.2);

const FRONT_EXHAUST_TILEMAP_OBJECT_NAME = "Front exhaust";
const FRONT_LEFT_EXHAUST_TILEMAP_OBJECT_NAME = "Front left exhaust";
const FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME = "Front right exhaust";
const REAR_LEFT_EXHAUST_TILEMAP_OBJECT_NAME = "Rear left exhaust";
const REAR_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME = "Rear right exhaust";
const REAR_EXHAUST_TILEMAP_OBJECT_NAME = "Rear exhaust";

export class Exhausts
{
  private readonly exhaustAnimationName =
    "Exhaust yellow rectangular Animation";
  private readonly exhaustSpriteAnimation: SpriteAnimation;

  private readonly front: ExhaustModel;
  private readonly frontLeft: ExhaustModel;
  private readonly frontRight: ExhaustModel;
  private readonly rearLeft: ExhaustModel;
  private readonly rearRight: ExhaustModel;
  private readonly rear: ExhaustModel;

  // ! Throws exception on error.
  constructor
  (
    scene: FlightScene,
    tilemap: Tilemap,
    tilemapObjectLayerName: string,
    textureAtlasAsset: TextureAtlasAsset,
    graphicContainer: GraphicContainer,
    exhaustSoundAsset: SoundAsset
  )
  {
    this.exhaustSpriteAnimation = this.createExhaustAnimation
    (
      scene,
      textureAtlasAsset.getId()
    );

    const exhaustConfig: ExhaustModel.Config =
    {
      scene,
      tilemap, // tilemap
      tilemapObjectLayerName,
      // exhaustTextureOrAtlasId: EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      exhaustTextureOrAtlasId: textureAtlasAsset.getId(),
      graphicContainer,
      exhaustAnimationName: this.exhaustAnimationName,
      exhaustSoundAsset
    };

    // ! Throws exception on error.
    this.front = new ExhaustModel
    (
      exhaustConfig, FRONT_EXHAUST_TILEMAP_OBJECT_NAME, FRONT_VOLUME
    );

    // ! Throws exception on error.
    this.frontLeft = new ExhaustModel
    (
      exhaustConfig, FRONT_LEFT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.frontRight = new ExhaustModel
    (
      exhaustConfig, FRONT_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.rearLeft = new ExhaustModel
    (
      exhaustConfig, REAR_LEFT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.rearRight = new ExhaustModel
    (
      exhaustConfig, REAR_RIGHT_EXHAUST_TILEMAP_OBJECT_NAME, SIDE_VOLUME
    );

    // ! Throws exception on error.
    this.rear = new ExhaustModel
    (
      exhaustConfig, REAR_EXHAUST_TILEMAP_OBJECT_NAME, REAR_VOLUME
    );
  }

  // ---------------- Public methods --------------------

  public update
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    // const frontExhaustScale = new ZeroToOne(-forwardThrustRatio.valueOf());
    const frontExhaustScale = (-forwardThrustRatio).atLeast(0);
    // const rearExhaustScale = new ZeroToOne(forwardThrustRatio.valueOf());
    // Note that rear thrusters always display at at least 10% length.
    const rearExhaustScale = forwardThrustRatio.atLeast(0.1);

    // // ! Throws exception on error.
    // setMinimumExhaustScale(rearExhaustScale, new ZeroToOne(0.1));

    this.front.update(new NonnegativeNumber(frontExhaustScale));
    this.rear.update(new NonnegativeNumber(rearExhaustScale));

    // Side thrusters get 50% of their length from left-right
    // thrust and another 50% from torque thrust (or possibly
    // a bit more in both cases if current thrust exceeds
    // standard maximum thrust).

    const leftThrustPortion = (leftwardThrustRatio / 2).atLeast(0);
    const rightThrustPortion = (-leftwardThrustRatio / 2).atLeast(0);
    const leftTorquePortion = (torqueRatio / 2).atLeast(0);
    const rightTorquePortion = (-torqueRatio / 2).atLeast(0);

    const frontLeftExhaustScale = rightThrustPortion + rightTorquePortion;
    const frontRightExhaustScale = leftThrustPortion + leftTorquePortion;
    const rearLeftExhaustScale = rightThrustPortion + leftTorquePortion;
    const rearRightExhaustScale = leftThrustPortion + rightTorquePortion;

    this.frontLeft.update(new NonnegativeNumber(frontLeftExhaustScale));
    this.frontRight.update(new NonnegativeNumber(frontRightExhaustScale));
    this.rearLeft.update(new NonnegativeNumber(rearLeftExhaustScale));
    this.rearRight.update(new NonnegativeNumber(rearRightExhaustScale));
  }

  // ---------------- Private methods -------------------

  private createExhaustAnimation(scene: FlightScene, textureAtlasId: string)
  {
    const exhaustAnimationConfig: SpriteAnimation.Config =
    {
      animationName: this.exhaustAnimationName,
      // textureAtlasId: EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      textureAtlasId,
      pathInTextureAtlas: "ExhaustYellowRectangular/",
      numberOfFrames: 8,
      frameRate: 25,
      repeat: SpriteAnimation.INFINITE_REPEAT
    };

    return scene.createAnimation(exhaustAnimationConfig);
  }
}

// ----------------- Auxiliary Functions ---------------------

// // ! Throws exception on error.
// function setMinimumExhaustScale(thrust: ZeroToOne, minimum: ZeroToOne)
// {
//   // ! Throws exception on error.
//   thrust.atLeast(minimum.valueOf());
// }