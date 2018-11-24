import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Engine/Sprite";
import { Container } from "../../Client/Engine/Container";
import { Scene } from "../../Client/Engine/Scene";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { Physics } from "../../Shared/Physics/Physics";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { ShapeGraphics } from "../../Client/FlightScene/ShapeGraphics";
import { VectorGraphics } from "../../Client/FlightScene/VectorsGraphics";
import { Ship } from "../../Client/Game/Ship";

const BASIC_SHIPS_TEXTURE_ID = "Basic ships Texture";
const EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID =
  "Exhaust yellow rectangular Texture atlas";
const BASIC_SHIPS_TILEMAP_ID = "Basic ships Tilemap";
const BASIC_SHIPS_TILEMAP_DATA_ID = "Basic ships Tilemap data";

const BASIC_FIGHTER_TILEMAP_LAYER = "Basic fighter";
const HULL_TILEMAP_OBJECT_NAME = "Hull";

export class ShipGraphics
{
  private readonly container: Container;
  private readonly basicShipsTilemap: Tilemap;
  private readonly shipSprites: Array<Sprite>;
  private readonly vectors: VectorGraphics;

  private readonly shapeGraphics: ShapeGraphics;

  // ! Throws exception on error.
  constructor
  (
    private readonly scene: FlightScene,
    shape: Physics.Shape,
  )
  {
    this.container = new Container(scene);
    this.container.setDepth(FlightScene.Z_ORDER_SHIPS);

    /// TODO: Tilemapu bude vyrábět zóna (asi v create()).
    this.basicShipsTilemap = new Tilemap
    (
      scene,
      /// TODO: Jméno tilemapy by se mělo brát
      /// ze Shared/Game/Ship/TILEMAP_NAME (aby bylo stejný na klientu
      /// i na serveru - je to ostatně stejná tilemapa). Teď není Client/Ship
      /// zděděná ze Shared/Ship, takže to není tak jednoduchý.
      BASIC_SHIPS_TILEMAP_ID,
      BASIC_SHIPS_TILEMAP_DATA_ID,
      /// TODO: Passovat samozřejmě JSON object s daty tilemapy.
      {}
    );

    // ! Throws exception on error.
    this.shipSprites = this.createShipSprites();
    this.shapeGraphics = new ShapeGraphics(scene, shape, this.container);

    this.vectors = new VectorGraphics(scene);
  }

  // ------------- Public static methods ----------------

  public static preload(scene: Scene)
  {
    scene.loadTexture
    (
      BASIC_SHIPS_TEXTURE_ID,
      "Textures/Ships/basic_ships.png"
    );

    scene.loadTextureAtlas
    (
      EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      "Textures/Effects/Exhausts/ExhaustYellowRectangular.json",
      "Textures/Effects/Exhausts"
    );

    scene.loadTilemapData
    (
      BASIC_SHIPS_TILEMAP_DATA_ID,
      "Tilemaps/Ships/basic_ships.json"
    );
  }

  // ---------------- Public methods --------------------

  public update(shipPosition: Vector)
  {
    this.vectors.update(shipPosition);
  }

  public setPosition(position: Vector)
  {
    this.container.setPosition(position);
  }

  public setRotation(rotation: number)
  {
    this.container.setRotation(rotation);
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
    return this.basicShipsTilemap.createSprites
    (
      BASIC_FIGHTER_TILEMAP_LAYER,
      tilemapObjectName,
      EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS_ID,
      {
        animationName,
        container: this.container,
        // This allows us to scale exhausts animations from the
        // start rather than from the middle.
        origin: { x: 0, y: 0.5 }
      }
    );
  }

  // ! Throws exception on error.
  private createShipSprites()
  {
    // ! Throws exception on error.
    return this.basicShipsTilemap.createSprites
    (
      BASIC_FIGHTER_TILEMAP_LAYER,
      HULL_TILEMAP_OBJECT_NAME,
      BASIC_SHIPS_TEXTURE_ID,
      {
        container: this.container
      }
    );
  }
}