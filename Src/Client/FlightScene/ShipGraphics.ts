import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Phaser/Sprite";
import { Container } from "../../Client/Phaser/Container";
import { Scene } from "../../Client/Phaser/Scene";
import { Tilemap } from "../../Client/Phaser/Tilemap";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { ShapeGraphics } from "../../Client/FlightScene/ShapeGraphics";
import { VectorGraphics } from "../../Client/FlightScene/VectorsGraphics";
import { Ship } from "../Game/Ship";

// const Z_ORDER_SHIP_SPRITE = 0;

const BASIC_SHIPS_TEXTURE = "BasicShips texture";
const EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS =
  "ExhaustYellowRectangular texture atlas";
const BASIC_SHIPS_TILEMAP = "Basic Ships";
const BASIC_SHIPS_TILEMAP_JSON_DATA = "Basic Ships tilemap JSON data";

const BASIC_FIGHTER_HULL_LAYER = "Basic Fighter Hull";
const SHIP_HULL_OBJECT = "Ship Hull";

const BASIC_FIGHTER_EXHAUSTS_TILEMAP_LAYER = "Basic Fighter Exhausts";

/// To be deleted.
// /// TODO: Tohle by mělo být spíš SHIP_TEXTURE
// /// (není to sprite, je to textura).
// const SHIP_SPRITE_ID = "ship_sprite";
// const EXHAUST_SPRITE_ID = "exhaust_00_sprite";
// const TEXTURE_EXHAUSTS_00 = "Exhausts00";
// const ATLAS_EXHAUST_YELLOW_RECTANGULAR = "atlas_exhaust_yellow_rectangular";
// // /// TileMaps test.
// const TILEMAP_FIGHTER = "tilemap_fighter";
// const TEXTURE_ROGUE = "texture_rogue";

export class ShipGraphics
{
  private readonly container: Container;
  private readonly basicShipsTilemap: Tilemap;
  private readonly shipSprites: Array<Sprite>;
  private readonly vectors: VectorGraphics;

  private readonly shapeGraphics: ShapeGraphics;

  /// To be deleted.
  // private readonly shipSprite: Sprite;

  // ! Throws exception on error.
  constructor
  (
    private readonly scene: FlightScene,
    shape: PhysicsBody.Shape,
  )
  {
    this.container = new Container(scene, 0, 0);
    this.container.setDepth(FlightScene.Z_ORDER_SHIPS);

    this.basicShipsTilemap = new Tilemap
    (
      scene,
      BASIC_SHIPS_TILEMAP,
      BASIC_SHIPS_TILEMAP_JSON_DATA
    );

    // ! Throws exception on error.
    this.shipSprites = this.createShipSprites();
    this.shapeGraphics = new ShapeGraphics(scene, shape, this.container);

    this.vectors = new VectorGraphics(scene);

    /// To be deleted.
    // // /// TileMaps test.
    // const map = scene.make.tilemap({ key: TILEMAP_FIGHTER });
    // // console.log(map);
    // const tilesetRogue = map.addTilesetImage
    // (
    //   /// Tohle je nejspíš jméno tilesetu v Tiled editoru.
    //   "rogue",
    //   TEXTURE_ROGUE
    // );
    // const shipLayer = map.createStaticLayer
    // (
    //   "graphics", tilesetRogue, -190, -190
    // );
    // this.container.addLayer(shipLayer);
    /// Potřebuju já vůbec tileset image? Budu z toho stejně dělat
    /// sprite (ale ta si asi bere texturu z tilesetu...)
    // const tilesetExhaust = map.addTilesetImage
    // (
    //   /// Tohle je jméno tilesetu v tiled editoru.
    //   "exhaust",
    //   ATLAS_EXHAUST_YELLOW_RECTANGULAR
    //   // "ExhaustYellowRectangular/001"
    // );

    // const testLayer = map.createDynamicLayer
    // (
    //   "animation_test", tilesetTest, 200, 200
    // );
    // // this.container.addLayer(testLayer);
    // // const thrusterLayer =
    // //   map.createStaticLayer("thrusters", tileset, -190, -190);

    // if (scene.animatedTilesPlugin !== "Not loaded")
    // {
    //   scene.animatedTilesPlugin.init(map);
    //   // console.log(scene.animatedTilesPlugin);
    // }

    //////////////////////////////////////////
    /// Test of atlas animated sprite created from object layer.
// const rearRightThrusters = map.createFromObjects
// (
//   /// Jméno object layeru.
//   "thrusters",
//   /// Jméno objektu v tiled editoru.
//   "rearRightThruster",
//   /// Tohle je id textury, která se má použít.
//   // { key: EXHAUST_SPRITE_ID }
//   // { key: "ExhaustYellowRectangular/001" }
//   /// Id texture atlasu zdá se funguje! - teď to ještě rozanimovat.
//   { key: ATLAS_EXHAUST_YELLOW_RECTANGULAR }
// );
// // console.log(rearRightThrusters);
// for (const thruster of rearRightThrusters)
// {
//   /// Origin spritu v Phaseru je uprostřed, ale v Tiled vlevo nahoře.
//   /// TODO: Vymyslet, odkud ta čísla brát
//   ///   (jsou to asi půlky rozměrů ship layeru)
//   thruster.setX(thruster.x - 190);
//   thruster.setY(thruster.y - 190);
//   this.container.addSprite(thruster);

//   const frameNames = scene.anims.generateFrameNames
//   (
//     ATLAS_EXHAUST_YELLOW_RECTANGULAR,
//     {
//       start: 1,
//       end: 8, // animation.numberOfFrames,
//       zeroPad: 3, // THREE_PLACES,
//       prefix: "ExhaustYellowRectangular/", // animation.pathInTextureAtlas,
//       /// Aha, já jsem asi v texture packeru vypnul přidávání suffixu
//       /// - to možná nebyl úplně dobrej nápad.
//       // suffix: ".png"
//       suffix: ""
//     }
//   );

//   // console.log(frameNames);

//   scene.anims.create
//   (
//     {
//       key: "animation_rear_right_thrusters", // animation.name,
//       frames: frameNames,
//       frameRate: 25, // animation.frameRate,
//       repeat: -1 // INFINITE
//     }
//   );
//   thruster.anims.play("animation_rear_right_thrusters"/*animation.name*/);
// }
    //////////////////////////////////////////
  }

  // ------------- Public static methods ----------------

  public static preload(scene: Scene)
  {
    scene.load.image(BASIC_SHIPS_TEXTURE, "Textures/Ships/basic_ships.png");

    scene.load.multiatlas
    (
      EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS,
      // Location of texture atlas in /Client.
      "Textures/Effects/Exhausts/ExhaustYellowRectangular.json",
      // Directory where textures are located in /Client.
      "Textures/Effects/Exhausts"
    );

    scene.load.tilemapTiledJSON
    (
      BASIC_SHIPS_TILEMAP_JSON_DATA,
      // Path relative to /Client.
      "TileMaps/Ships/basic_ships.json"
    );

    /// To be delted.
    // scene.load.image(SHIP_SPRITE_ID, "Textures/Ships/hecate.png");

    // scene.load.multiatlas
    // (
    //   TEXTURE_EXHAUSTS_00,
    //   // Location of texture atlas.
    //   "Textures/Effects/Exhausts/Exhausts00.json",
    //   // Directory where textures are located.
    //   "Textures/Effects/Exhausts"
    // );

    // /// Test of atlas animated sprite created from object layer.
    // scene.load.multiatlas
    // (
    //   ATLAS_EXHAUST_YELLOW_RECTANGULAR,
    //   // Location of texture atlas in /Client.
    //   "Textures/Effects/Exhausts/ExhaustYellowRectangular.json",
    //   // Directory where textures are located in /Client.
    //   "Textures/Effects/Exhausts"
    // );

    // /// TileMaps test.
    // scene.load.tilemapTiledJSON
    // (
    //   TILEMAP_FIGHTER,
    //   "TileMaps/Ships/fighter.json"
    // );
    // scene.load.image(TEXTURE_ROGUE, "Textures/Ships/rogue.png");
    // scene.load.image
    // (
    //   "test_animation_texture",
    //   "Textures/Effects/Exhausts/ExhaustYellowRectangular.png"
    // );
    // scene.load.image
    // (
    //   EXHAUST_SPRITE_ID,
    //   "Textures/Effects/Exhausts/ExhaustYellowRectangular/001.png"
    // );
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

  public createExhaustSpriteAnimation(name: string)
  {
    const animation: Sprite.Animation =
    {
      name,
      textureAtlasId: EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS,
      pathInTextureAtlas: "ExhaustYellowRectangular/",
      numberOfFrames: 8,
      frameRate: 25
    };

    Sprite.createAnimation(this.scene, animation);
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
      BASIC_FIGHTER_EXHAUSTS_TILEMAP_LAYER,
      tilemapObjectName,
      EXHAUST_YELLOW_RECTANGULAR_TEXTURE_ATLAS,
      {
        animationName,
        container: this.container,
        origin: { x: 0, y: 0.5 }
      }
    );
  }

  // public createExhaustSprite
  // (
  //   animationNumber: string,
  //   x: number,
  //   y: number,
  //   rotation: number,
  //   baseScale: number
  // )
  // {
  //   const texture = TEXTURE_EXHAUSTS_00;

  //   const animation: Sprite.Animation =
  //   {
  //     name: `animation_exhausts_${animationNumber}`,
  //     // Path inside a texture atlas.
  //     pathInTextureAtlas: "ExhaustYellowRectangular/",
  //     numberOfFrames: 8,
  //     frameRate: 25
  //   };

  //   const sprite = new Sprite
  //   (
  //     this.scene,
  //     { x, y },
  //     rotation,
  //     texture,
  //     { animation, container: this.container }
  //   );

  //   sprite.setBaseScale(baseScale);

  //   return sprite;
  // }

//   public updateExhausts
//   (
//     forwardThrustRatio: number,
//     leftwardThrustRatio: number,
//     torqueRatio: number
//   )
//   {
//     const frontExhaustsScale = lowerBound(-forwardThrustRatio, 0);
//     for (const sprite of this.exhaustSprites.front)
//       sprite.setScaleY(frontExhaustsScale);

//     let rearExhaustsScale = lowerBound(forwardThrustRatio, 0.05);
//     rearExhaustsScale *= 2;
//     for (const sprite of this.exhaustSprites.rear)
//       sprite.setScaleY(rearExhaustsScale);

//     // The idea is that side thrusters get 50% of their length from
//     // left-right thrust and another 50% from torque thrust
//     // (it's probably not matematically correct but it's for display
//     //  purposes only).

//     let frontLeftExhaustScale = lowerBound(leftwardThrustRatio / 2, 0);
//     frontLeftExhaustScale += lowerBound(-torqueRatio / 2, 0);
//     for (const sprite of this.exhaustSprites.frontLeft)
//       sprite.setScaleY(frontLeftExhaustScale);

//     let frontRightExhaustScale = lowerBound(-leftwardThrustRatio / 2, 0);
//     frontRightExhaustScale += lowerBound(torqueRatio / 2, 0);
//     for (const sprite of this.exhaustSprites.frontRight)
//       sprite.setScaleY(frontRightExhaustScale);

//     let backLeftExhaustScale = lowerBound(leftwardThrustRatio / 2, 0);
//     backLeftExhaustScale += lowerBound(torqueRatio / 2, 0);
//     for (const sprite of this.exhaustSprites.backLeft)
//       sprite.setScaleY(backLeftExhaustScale);

//     let backRightExhaustScale = lowerBound(-leftwardThrustRatio / 2, 0);
//     backRightExhaustScale += lowerBound(-torqueRatio / 2, 0);
//     for (const sprite of this.exhaustSprites.backRight)
//       sprite.setScaleY(backRightExhaustScale);
//   }

  // ! Throws exception on error.
  private createShipSprites()
  {
    // ! Throws exception on error.
    return this.basicShipsTilemap.createSprites
    (
      BASIC_FIGHTER_HULL_LAYER,
      SHIP_HULL_OBJECT,
      BASIC_SHIPS_TEXTURE,
      {
        container: this.container
      }
    );
  }
}

// ----------------- Auxiliary Functions ---------------------

/// To be deleted
/// (ship sprite se vyrábět bude, ale z object layeru tilesetu).
// function createShipSprite(scene: Phaser.Scene, container: Container)
// {
//   const position = { x: 0, y: 0 };
//   const rotation = 0;

//   const shipSprite = new Sprite
//   (
//     scene, position, rotation, SHIP_SPRITE_ID, { container }
//   );

//   // shipSprite.setScrollFactor(0.5);

//   shipSprite.setDepth(Z_ORDER_SHIP_SPRITE);

//   container.add(shipSprite);

//   return shipSprite;
// }

// function createExhaustSprites(scene: Phaser.Scene, container: Container)
// {
//   const exhaustSprites: ExhaustSprites =
//   {
//     front:
//     [
//       createExhaustSprite("0", 120, -65, -Math.PI / 2, scene, container),
//       createExhaustSprite("1", 120, 65, -Math.PI / 2, scene, container)
//     ],
//     frontLeft:
//     [
//       createExhaustSprite("2", 100, -67, Math.PI, scene, container)
//     ],
//     backLeft:
//     [
//       createExhaustSprite("3", -95, -120, Math.PI, scene, container)
//     ],
//     frontRight:
//     [
//       createExhaustSprite("4", 100, 67, 0, scene, container)
//     ],
//     backRight:
//     [
//       createExhaustSprite("5", -95, 120, 0, scene, container)
//     ],
//     rear:
//     [
//       createExhaustSprite("6", -190, -50, Math.PI / 2, scene, container),
//       createExhaustSprite("7", -190, 50, Math.PI / 2, scene, container)
//     ]
//   };

//   // TODO: Tohle hodit rovnou jako parametr createExhaustSprite()
//   // (beztak to budu muset nějak vymyslet s prodlužováním exhaustu).
//   for (const sprite of exhaustSprites.rear)
//   {
//     sprite.setScale(2);
//   }

//   return exhaustSprites;
// }