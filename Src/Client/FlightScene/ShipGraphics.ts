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

function createExhaustSprites(scene: Phaser.Scene, container: Container)
{
  const ANIMATION_NAME = "animation_exhausts_00";
  const texture = TEXTURE_EXHAUSTS_00;

  const animation: Sprite.Animation =
  {
    name: ANIMATION_NAME,
    // Path inside a texture atlas.
    pathInTextureAtlas: "ExhaustYellowRectangular/",
    numberOfFrames: 8,
    frameRate: 25
  };

  const exhaustSprites: ExhaustSprites =
  {
    front:
    [
      new Sprite
      (
        scene,
        { x: 120, y: -65 },
        -Math.PI / 2,
        texture,
        { animation, container }
      ),
      new Sprite
      (
        scene,
        { x: 120, y: 65 },
        -Math.PI / 2,
        texture,
        { animation, container }
      ),
    ],
    frontLeft:
    [
      new Sprite
      (
        scene,
        { x: 100, y: -67},
        Math.PI,
        texture,
        { animation, container }
      ),
    ],
    backLeft:
    [
      new Sprite
      (
        scene,
        { x: -95, y: -120},
        Math.PI,
        texture,
        { animation, container }
      ),
    ],
    frontRight:
    [
      new Sprite
      (
        scene,
        { x: 100, y: 67},
        0,
        texture,
        { animation, container }
      ),
    ],
    backRight:
    [
      new Sprite
      (
        scene,
        { x: -95, y: 120},
        0,
        texture,
        { animation, container }
      ),
    ],
    rear:
    [
      new Sprite
      (
        scene,
        { x: -190, y: -50},
        Math.PI / 2,
        texture,
        { animation, container }
      ),
      new Sprite
      (
        scene,
        { x: -190, y: 50},
        Math.PI / 2,
        texture,
        { animation, container }
      ),
    ]
  };

  for (const sprite of exhaustSprites.rear)
  {
    sprite.setScale(2);
  }

  return exhaustSprites;
}