import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { ExhaustModel } from "../../Client/Flight/ExhaustModel";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { SpriteAnimation } from "../Engine/SpriteAnimation";

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
    graphicContainer: GraphicContainer,
    exhaustSoundId: string
  )
  {
    this.exhaustSpriteAnimation = this.createExhaustAnimation(scene);

    const exhaustConfig: ExhaustModel.Config =
    {
      scene,
      tilemap,
      tilemapObjectLayerName,
      exhaustTextureOrAtlasId: EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      graphicContainer,
      exhaustAnimationName: this.exhaustAnimationName,
      exhaustSoundId
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
    forwardThrustRatio: MinusOneToOne,
    leftwardThrustRatio: MinusOneToOne,
    torqueRatio: MinusOneToOne
  )
  {
    const frontExhaustScale = new ZeroToOne(-forwardThrustRatio.valueOf());
    const rearExhaustScale = new ZeroToOne(forwardThrustRatio.valueOf());

    // ! Throws exception on error.
    setMinimumExhaustScale(rearExhaustScale, new ZeroToOne(0.1));

    this.front.update(frontExhaustScale);
    this.rear.update(rearExhaustScale);

    // Side thrusters get 50% of their length from left-right
    // thrust and another 50% from torque thrust.

    const leftThrustPortion =
      new ZeroToOne(leftwardThrustRatio.valueOf() / 2).valueOf();
    const rightThrustPortion =
      new ZeroToOne(-leftwardThrustRatio.valueOf() / 2).valueOf();
    const leftTorquePortion =
      new ZeroToOne(torqueRatio.valueOf() / 2).valueOf();
    const rightTorquePortion =
      new ZeroToOne(-torqueRatio.valueOf() / 2).valueOf();

    const frontLeftExhaustScale = rightThrustPortion + rightTorquePortion;
    const frontRightExhaustScale = leftThrustPortion + leftTorquePortion;
    const rearLeftExhaustScale = rightThrustPortion + leftTorquePortion;
    const rearRightExhaustScale = leftThrustPortion + rightTorquePortion;

    this.frontLeft.update(new ZeroToOne(frontLeftExhaustScale));
    this.frontRight.update(new ZeroToOne(frontRightExhaustScale));
    this.rearLeft.update(new ZeroToOne(rearLeftExhaustScale));
    this.rearRight.update(new ZeroToOne(rearRightExhaustScale));
  }

  // ---------------- Private methods -------------------

  private createExhaustAnimation(scene: FlightScene)
  {
    const exhaustAnimationConfig: SpriteAnimation.Config =
    {
      animationName: this.exhaustAnimationName,
      textureAtlasId: EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      pathInTextureAtlas: "ExhaustYellowRectangular/",
      numberOfFrames: 8,
      frameRate: 25,
      repeat: SpriteAnimation.INFINITE_REPEAT
    };

    return scene.createAnimation(exhaustAnimationConfig);
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function setMinimumExhaustScale(thrust: ZeroToOne, minimum: ZeroToOne)
{
  // ! Throws exception on error.
  thrust.atLeast(minimum.valueOf());
}