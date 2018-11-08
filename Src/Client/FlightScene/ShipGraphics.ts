import { lowerBound } from "../../Shared/Utils/Math";
import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Phaser/Sprite";
import { Container } from "../../Client/Phaser/Container";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { ShapeGraphics } from "../../Client/FlightScene/ShapeGraphics";
import { VectorGraphics } from "../../Client/FlightScene/VectorsGraphics";
import { Ship } from "../Game/Ship";

const Z_ORDER_SHIP_SPRITE = 0;

const SHIP_SPRITE_ID = "ship";

const TEXTURE_EXHAUSTS_00 = "Exhausts00";

type ExhaustSprites =
{
  front: Array<Sprite>;
  frontLeft: Array<Sprite>;
  backLeft: Array<Sprite>;
  frontRight: Array<Sprite>;
  backRight: Array<Sprite>;
  rear: Array<Sprite>;
};

export class ShipGraphics
{
  private readonly container: Container;
  private readonly shipSprite: Sprite;
  private readonly exhaustSprites: ExhaustSprites;
  private readonly vectors: VectorGraphics;

  private readonly shapeGraphics: ShapeGraphics;

  constructor
  (
    scene: Phaser.Scene,
    shape: PhysicsBody.Shape,
  )
  {
    this.container = new Container(scene, 0, 0);
    this.container.setDepth(FlightScene.Z_ORDER_SHIPS);

    this.shipSprite = createShipSprite(scene, this.container);
    this.shapeGraphics = new ShapeGraphics(scene, shape, this.container);
    this.exhaustSprites = createExhaustSprites(scene, this.container);

    this.vectors = new VectorGraphics(scene);
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

  public updateExhausts
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    const frontExhaustsScale = lowerBound(-forwardThrustRatio, 0);
    for (const sprite of this.exhaustSprites.front)
      sprite.setScaleY(frontExhaustsScale);

    let rearExhaustsScale = lowerBound(forwardThrustRatio, 0.05);
    rearExhaustsScale *= 2;
    for (const sprite of this.exhaustSprites.rear)
      sprite.setScaleY(rearExhaustsScale);

    // The idea is that side thrusters get 50% of their length from
    // left-right thrust and another 50% from torque thrust
    // (it's probably not matematically correct but it's for display
    //  purposes only).

    let frontLeftExhaustScale = lowerBound(leftwardThrustRatio / 2, 0);
    frontLeftExhaustScale += lowerBound(-torqueRatio / 2, 0);
    for (const sprite of this.exhaustSprites.frontLeft)
      sprite.setScaleY(frontLeftExhaustScale);

    let frontRightExhaustScale = lowerBound(-leftwardThrustRatio / 2, 0);
    frontRightExhaustScale += lowerBound(torqueRatio / 2, 0);
    for (const sprite of this.exhaustSprites.frontRight)
      sprite.setScaleY(frontRightExhaustScale);

    let backLeftExhaustScale = lowerBound(leftwardThrustRatio / 2, 0);
    backLeftExhaustScale += lowerBound(torqueRatio / 2, 0);
    for (const sprite of this.exhaustSprites.backLeft)
      sprite.setScaleY(backLeftExhaustScale);

    let backRightExhaustScale = lowerBound(-leftwardThrustRatio / 2, 0);
    backRightExhaustScale += lowerBound(-torqueRatio / 2, 0);
    for (const sprite of this.exhaustSprites.backRight)
      sprite.setScaleY(backRightExhaustScale);
  }
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

function createExhaustSprite
(
  animationNumber: string,
  x: number,
  y: number,
  rotation: number,
  scene: Phaser.Scene,
  container: Container
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

  return new Sprite
  (
    scene,
    { x, y },
    rotation,
    texture,
    { animation, container }
  );
}

function createExhaustSprites(scene: Phaser.Scene, container: Container)
{
  const exhaustSprites: ExhaustSprites =
  {
    front:
    [
      createExhaustSprite("0", 120, -65, -Math.PI / 2, scene, container),
      createExhaustSprite("1", 120, 65, -Math.PI / 2, scene, container)
    ],
    frontLeft:
    [
      createExhaustSprite("2", 100, -67, Math.PI, scene, container)
    ],
    backLeft:
    [
      createExhaustSprite("3", -95, -120, Math.PI, scene, container)
    ],
    frontRight:
    [
      createExhaustSprite("4", 100, 67, 0, scene, container)
    ],
    backRight:
    [
      createExhaustSprite("5", -95, 120, 0, scene, container)
    ],
    rear:
    [
      createExhaustSprite("6", -190, -50, Math.PI / 2, scene, container),
      createExhaustSprite("7", -190, 50, Math.PI / 2, scene, container)
    ]
  };

  // TODO: Tohle hodit rovnou jako parametr createExhaustSprite()
  // (beztak to budu muset nějak vymyslet s prodlužováním exhaustu).
  for (const sprite of exhaustSprites.rear)
  {
    sprite.setScale(2);
  }

  return exhaustSprites;
}