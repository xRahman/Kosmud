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

export class ShipGraphics
{
  private container: Container;
  private sprite: Sprite;
  private vectors: VectorGraphics;

  private shapeGraphics: ShapeGraphics;

  constructor
  (
    scene: Phaser.Scene,
    shape: PhysicsBody.Shape,
  )
  {
    this.container = new Container(scene, 0, 0);
    this.container.setDepth(FlightScene.Z_ORDER_SHIPS);

    this.sprite = createShipSprite(scene);
    this.container.add(this.sprite);

    this.shapeGraphics = new ShapeGraphics(scene, shape);
    this.container.add(this.shapeGraphics);

    this.vectors = new VectorGraphics(scene);
  }

  // ------------- Public static methods ----------------

  public static preload(scene: Phaser.Scene)
  {
    scene.load.image(SHIP_SPRITE_ID, "/Graphics/Ships/hecate.png");
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

  public getPosition(): Vector
  {
    return this.container.getPosition();
  }

  public setRotation(rotation: number)
  {
    this.container.setRotation(rotation);
  }

  public getRotation()
  {
    return this.container.getRotation();
  }

  public drawVectors(vectors: Ship.Vectors)
  {
    this.vectors.draw(vectors);
  }
}

// ----------------- Auxiliary Functions ---------------------

function createShipSprite(scene: Phaser.Scene)
{
  const shipSprite = new Sprite(scene, 0, 0, SHIP_SPRITE_ID);

  // shipSprite.setScrollFactor(0.5);

  shipSprite.setDepth(Z_ORDER_SHIP_SPRITE);

  return shipSprite;
}