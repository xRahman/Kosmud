import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Engine/Sprite";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { ShapeModel } from "../../Client/Flight/ShapeModel";
import { VectorsModel } from "../../Client/Flight/VectorsModel";
import { ShipAudio } from "../../Client/Flight/ShipAudio";
import { ShipExhausts } from "../../Client/Game/ShipExhausts";
import { Vehicle } from "../../Shared/Physics/Vehicle";
import { Physics } from "../../Shared/Physics/Physics";

const BASIC_SHIPS_TEXTURE_ID = "Basic ships Texture";
const EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID =
  "Exhaust yellow rectangular Texture atlas";

const BASIC_FIGHTER_TILEMAP_LAYER = "Basic fighter";
const HULL_TILEMAP_OBJECT_NAME = "Hull";

export class ShipModel
{
  private readonly graphicContainer: GraphicContainer;
  private readonly shipSprites: Array<Sprite>;
  private readonly vectorsModel: VectorsModel;

  private readonly exhausts: ShipExhausts;
  private readonly audio: ShipAudio;

  private readonly shapeModel: ShapeModel;

  // ! Throws exception on error.
  constructor
  (
    private readonly scene: FlightScene,
    private readonly tilemap: Tilemap,
    shape: Physics.Shape,
    engineSoundId: string
  )
  {
    this.graphicContainer = scene.createGraphicContainer();
    this.graphicContainer.setDepth(FlightScene.Z_ORDER_SHIPS);

    this.audio = new ShipAudio(scene, engineSoundId);

    // ! Throws exception on error.
    this.exhausts = new ShipExhausts(this, this.audio);

    // ! Throws exception on error.
    this.shipSprites = this.createShipSprites();
    this.shapeModel = new ShapeModel
    (
      scene,
      shape,
      this.graphicContainer
    );

    this.vectorsModel = new VectorsModel(scene);
  }

  // ---------------- Public methods --------------------

  public setPosition(position: Vector)
  {
    this.graphicContainer.setPosition(position);
    this.vectorsModel.update(position);
  }

  public setRotation(rotation: number)
  {
    this.graphicContainer.setRotation(rotation);
  }

  public drawVectors(vehicle: Vehicle)
  {
    this.vectorsModel.draw(vehicle);
  }

  // ! Throws exception on error.
  public createExhaustSpriteAnimation(name: string)
  {
    /// TODO: Výhledově používat tile animaci vytvořenou v Tiled
    ///   editoru a číst ji z dat tilemapy.
    const animation: Sprite.Animation =
    {
      name,
      textureAtlasId: EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      pathInTextureAtlas: "ExhaustYellowRectangular/",
      numberOfFrames: 8,
      frameRate: 25
    };

    // ! Throws exception on error.
    this.scene.createAnimation(animation);
  }

  // ! Throws exception on error.
  public createExhaustSprites
  (
    tilemapObjectName: string,
    animationName: string
  )
  : Array<Sprite>
  {
    // ! Throws exception on error.
    return this.tilemap.createSprites
    (
      this.scene,
      BASIC_FIGHTER_TILEMAP_LAYER,
      tilemapObjectName,
      {
        animationName,
        graphicContainer: this.graphicContainer,
        // This allows us to scale exhausts animations from the
        // start rather than from the middle.
        origin: { x: 0, y: 0.5 },
        textureOrAtlasId: EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID
      }
    );
  }

  /// TODO: Tohle udělat nějak líp (provolávání přes 3 classy se mi nelíbí)
  public updateExhausts
  (
    forwardThrustRatio: MinusOneToOne,
    leftwardThrustRatio: MinusOneToOne,
    torqueRatio: MinusOneToOne
  )
  {
    this.exhausts.update
    (
      forwardThrustRatio,
      leftwardThrustRatio,
      torqueRatio
    );
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private createShipSprites()
  {
    // ! Throws exception on error.
    return this.tilemap.createSprites
    (
      this.scene,
      BASIC_FIGHTER_TILEMAP_LAYER,
      HULL_TILEMAP_OBJECT_NAME,
      {
        graphicContainer: this.graphicContainer,
        textureOrAtlasId: BASIC_SHIPS_TEXTURE_ID
      }
    );
  }
}