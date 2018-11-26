import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Engine/Sprite";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { ShapeGraphics } from "../../Client/FlightScene/ShapeGraphics";
import { VectorGraphics } from "../../Client/FlightScene/VectorsGraphics";
import { ShipAudio } from "../../Client/FlightScene/ShipAudio";
import { ShipExhausts } from "../../Client/Game/ShipExhausts";
import { Ship } from "../../Client/Game/Ship";
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
  private readonly vectors: VectorGraphics;

  private readonly exhausts: ShipExhausts;
  private readonly audio: ShipAudio;

  private readonly shapeGraphics: ShapeGraphics;

  // ! Throws exception on error.
  constructor
  (
    private readonly scene: FlightScene,
    private readonly tilemap: Tilemap,
    shape: Physics.Shape,
    engineSoundId: string
  )
  {
    this.graphicContainer = new GraphicContainer(scene);
    this.graphicContainer.setDepth(FlightScene.Z_ORDER_SHIPS);

    // ! Throws exception on error.
    this.shipSprites = this.createShipSprites();
    this.shapeGraphics = new ShapeGraphics
    (
      scene,
      shape,
      this.graphicContainer
    );

    this.vectors = new VectorGraphics(scene);

    this.audio = new ShipAudio(scene, engineSoundId);

    // ! Throws exception on error.
    this.exhausts = new ShipExhausts(this, this.audio);
  }

  // ------------- Public static methods ----------------

  /// Tohle se teď dělá v zone.preload()
  // public static preload(scene: Scene)
  // {
  //   scene.loadTexture
  //   (
  //     BASIC_SHIPS_TEXTURE_ID,
  //     "Textures/Ships/basic_ships.png"
  //   );

  //   scene.loadTextureAtlas
  //   (
  //     EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
  //     "Textures/Effects/Exhausts/ExhaustYellowRectangular.json",
  //     "Textures/Effects/Exhausts"
  //   );

  //   scene.loadTilemapData
  //   (
  //     BASIC_SHIPS_TILEMAP_DATA_ID,
  //     "Tilemaps/Ships/basic_ships.json"
  //   );
  // }

  // ---------------- Public methods --------------------

  public setPosition(position: Vector)
  {
    this.graphicContainer.setPosition(position);
    this.vectors.update(position);
  }

  public setRotation(rotation: number)
  {
    this.graphicContainer.setRotation(rotation);
  }

  public drawVectors(vectors: Ship.Vectors)
  {
    this.vectors.draw(vectors);
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
      BASIC_FIGHTER_TILEMAP_LAYER,
      tilemapObjectName,
      EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      {
        animationName,
        graphicContainer: this.graphicContainer,
        // This allows us to scale exhausts animations from the
        // start rather than from the middle.
        origin: { x: 0, y: 0.5 }
      }
    );
  }

  /// TODO: Tohle udělat nějak líp (provolávání přes 3 classy se mi nelíbí)
  public updateExhausts
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
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
      BASIC_FIGHTER_TILEMAP_LAYER,
      HULL_TILEMAP_OBJECT_NAME,
      BASIC_SHIPS_TEXTURE_ID,
      {
        graphicContainer: this.graphicContainer
      }
    );
  }
}