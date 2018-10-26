import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Graphics } from "../../Client/Phaser/Graphics";
import { FlightScene } from "../../Client/Phaser/FlightScene";

const SHIP_SPRITE_ID = "ship";

const Z_ORDER_SHIP_SPRITE = 0;
const Z_ORDER_DEBUG = Z_ORDER_SHIP_SPRITE + 1;

export class Ship
{
  private container: Phaser.GameObjects.Container;
  private sprite: Phaser.GameObjects.Sprite;
  private debugGeometry: Graphics;
  private debugVectors: Graphics;

  /// TODO: To samé je na serveru.
  private desiredVelocity = new Vector();
  private steeringForce = new Vector();

  constructor
  (
    private scene: Phaser.Scene,
    private geometry: PhysicsBody.Geometry,
    position: Vector,
    angle: number
  )
  {
    this.container = scene.add.container(0, 0);

    this.container.setDepth(FlightScene.Z_ORDER_SHIPS);

    this.sprite = createShipSprite(this.scene);
    this.container.add(this.sprite);

    this.debugGeometry = new Graphics(scene, Z_ORDER_DEBUG);
    this.debugGeometry.drawBodyGeometry(geometry);
    this.container.add(this.debugGeometry.getPhaserObject());

    this.debugVectors = new Graphics(scene, Z_ORDER_DEBUG);
    this.container.add(this.debugVectors.getPhaserObject());

    this.setPositionAndAngle(position, angle);
  }

  public static preload(scene: Phaser.Scene)
  {
    scene.load.image(SHIP_SPRITE_ID, "/Graphics/Ships/hecate.png");
  }

  // ---------------- Public methods --------------------

  public setPositionAndAngle(position: Vector, angleRadians: number)
  {
    this.container.x = position.x;
    this.container.y = position.y;
    this.container.rotation = angleRadians;
  }

  public setDesiredVelocity(desiredVelocity: Vector)
  {
    this.desiredVelocity = desiredVelocity;
    this.updateVectorsDebugGraphics();
  }

  public setSteeringForce(steeringForce: Vector)
  {
    this.steeringForce = steeringForce;
    this.updateVectorsDebugGraphics();
  }

  // ---------------- Private methods -------------------

  private updateVectorsDebugGraphics()
  {
    this.debugVectors.clear();

    this.debugVectors.drawVector
    (
      this.desiredVelocity,
      new Vector(),
      0x0000FF
    );

    this.debugVectors.drawVector
    (
      this.steeringForce,
      new Vector(),
      0xFFFF00
    );
  }
}

// ----------------- Auxiliary Functions ---------------------

function createShipSprite(scene: Phaser.Scene)
{
  const shipSprite = scene.add.sprite(0, 0, SHIP_SPRITE_ID);

  // shipSprite.setScrollFactor(0.5);

  shipSprite.setDepth(Z_ORDER_SHIP_SPRITE);

  return shipSprite;
}