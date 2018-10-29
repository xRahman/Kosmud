import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Phaser/Sprite";
import { Container } from "../../Client/Phaser/Container";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { FlightScene } from "../../Client/Phaser/FlightScene";
import { GeometryGraphics } from "../../Client/Phaser/GeometryGraphics";

const Z_ORDER_SHIP_SPRITE = 0;

const SHIP_SPRITE_ID = "ship";

export class ShipGraphics
{
  private container: Container;
  private sprite: Sprite;

  private geometryGraphics: GeometryGraphics;

  constructor
  (
    private scene: Phaser.Scene,
    private physicsGeometry: PhysicsBody.Geometry,
  )
  {
    this.container = new Container(scene, 0, 0);
    this.container.setDepth(FlightScene.Z_ORDER_SHIPS);

    this.sprite = createShipSprite(this.scene);
    this.container.add(this.sprite);

    this.geometryGraphics = new GeometryGraphics(scene, physicsGeometry);
    this.container.add(this.geometryGraphics);
  }

  // ------------- Public static methods ----------------

  public static preload(scene: Phaser.Scene)
  {
    scene.load.image(SHIP_SPRITE_ID, "/Graphics/Ships/hecate.png");
  }

  // ---------------- Public methods --------------------

  public setPositionAndAngle(position: Vector, angle: number)
  {
    this.container.setPosition(position);
    this.container.setRotation(angle);
  }

  public getPosition(): Vector
  {
    return this.container.getPosition();
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