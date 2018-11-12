import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Phaser/Sprite";
import { Container } from "../../Client/Phaser/Container";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { ShapeGraphics } from "../../Client/FlightScene/ShapeGraphics";
import { VectorGraphics } from "../../Client/FlightScene/VectorsGraphics";
import { Ship } from "../Game/Ship";

const Z_ORDER_SHIP_SPRITE = 0;

/// TODO: Tohle by mělo být spíš SHIP_TEXTURE
/// (není to sprite, je to textura).
const SHIP_SPRITE_ID = "ship_sprite";
const EXHAUST_SPRITE_ID = "exhaust_00_sprite";

const TEXTURE_EXHAUSTS_00 = "Exhausts00";

const SHIP_ROGUE = "ship_rogue";
const IMAGE_ROGUE = "image_rogue";

export class ShipGraphics
{
  private readonly tmp: any;

  private readonly container: Container;
  private readonly shipSprite: Sprite;
  private readonly vectors: VectorGraphics;

  private readonly shapeGraphics: ShapeGraphics;

  constructor
  (
    private readonly scene: Phaser.Scene,
    shape: PhysicsBody.Shape,
  )
  {
    this.container = new Container(scene, 0, 0);
    this.container.setDepth(FlightScene.Z_ORDER_SHIPS);

    /// TileMaps test.
    const map = scene.make.tilemap({ key: SHIP_ROGUE });
    const tileset = map.addTilesetImage("rogue", IMAGE_ROGUE);
    const shipLayer = map.createStaticLayer("graphics", tileset, -190, -190);
    this.container.addLayer(shipLayer);
    // const thrusterLayer =
    //   map.createStaticLayer("thrusters", tileset, -190, -190);

    const rearRightThrusters = map.createFromObjects
    (
      /// Jméno object layeru.
      "thrusters",
      /// Jméno objektu v tiled editoru.
      "rearRightThruster",
      /// Tohle je id textury, která se má použít.
      { key: EXHAUST_SPRITE_ID }
    );
    console.log(rearRightThrusters);
    for (const thruster of rearRightThrusters)
    {
      /// Origin spritu v Phaseru je uprostřed, ale v Tiled vlevo nahoře.
      /// TODO: Vymyslet, odkud ta čísla brát
      ///   (jsou to asi půlky rozměrů ship layeru)
      thruster.setX(thruster.x - 190);
      thruster.setY(thruster.y - 190);
      this.container.addSprite(thruster);
    }

    this.shipSprite = createShipSprite(scene, this.container);
    this.shapeGraphics = new ShapeGraphics(scene, shape, this.container);
    // this.exhaustSprites = createExhaustSprites(scene, this.container);

    this.vectors = new VectorGraphics(scene);

    // // layer.setRotation(Math.PI / 6);
    // const tmpSprite = scene.add.sprite(0, 0, SHIP_SPRITE_ID);
    // this.tmp = scene.add.container(0, 0);
    // this.tmp.add(layer);
    // this.tmp.add(tmpSprite);

    // layer.rotation = Math.PI / 6;
    // layer.x = 200;
    // layer.
  }

  // ------------- Public static methods ----------------

  public static preload(scene: Phaser.Scene)
  {
    scene.load.image(SHIP_SPRITE_ID, "Textures/Ships/hecate.png");

    scene.load.multiatlas
    (
      TEXTURE_EXHAUSTS_00,
      // Location of texture atlas.
      "Textures/Effects/Exhausts/Exhausts00.json",
      // Directory where textures are located.
      "Textures/Effects/Exhausts"
    );

    /// TileMaps test.
    scene.load.tilemapTiledJSON
    (
      SHIP_ROGUE,
      "TileMaps/Ships/rogue.json"
    );
    scene.load.image(IMAGE_ROGUE, "Textures/Ships/rogue.png");
    scene.load.image
    (
      EXHAUST_SPRITE_ID,
      "Textures/Effects/Exhausts/ExhaustYellowRectangular/001.png");
  }

  // ---------------- Public methods --------------------

  public update(shipPosition: Vector)
  {
    this.vectors.update(shipPosition);

    // this.tmp.setRotation(this.tmp.rotation + Math.PI / 120);
    // this.tmp.setX(this.tmp.x + 1);
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

  public createExhaustSprite
  (
    animationNumber: string,
    x: number,
    y: number,
    rotation: number,
    baseScale: number
  )
  {
    const texture = TEXTURE_EXHAUSTS_00;

    const animation: Sprite.Animation =
    {
      name: `animation_exhausts_${animationNumber}`,
      // Path inside a texture atlas.
      pathInTextureAtlas: "ExhaustYellowRectangular/",
      numberOfFrames: 8,
      frameRate: 25
    };

    const sprite =  new Sprite
    (
      this.scene,
      { x, y },
      rotation,
      texture,
      { animation, container: this.container }
    );

    sprite.setBaseScale(baseScale);

    return sprite;
  }

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
}

// ----------------- Auxiliary Functions ---------------------

function createShipSprite(scene: Phaser.Scene, container: Container)
{
  const position = { x: 0, y: 0 };
  const rotation = 0;

  const shipSprite = new Sprite
  (
    scene, position, rotation, SHIP_SPRITE_ID, { container }
  );

  // shipSprite.setScrollFactor(0.5);

  shipSprite.setDepth(Z_ORDER_SHIP_SPRITE);

  container.add(shipSprite);

  return shipSprite;
}

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