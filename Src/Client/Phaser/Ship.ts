import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Graphics } from "../../Client/Phaser/Graphics";
import { FlightScene } from "../../Client/Phaser/FlightScene";

const SHIP_SPRITE_ID = "ship";

export class Ship
{
  constructor
  (
    private scene: Phaser.Scene,
    private geometry: PhysicsBody.Geometry,
    position: Vector,
    angle: number
  )
  {
    this.container = scene.add.container(0, 0);
    this.sprite = createShipSprite(this.scene);
    this.container.add(this.sprite);

    this.debugGraphics = new Graphics(scene, FlightScene.Z_ORDER_DEBUG);
    this.debugGraphics.drawBodyGeometry(geometry);
    this.container.add(this.debugGraphics.getPhaserObject());
  }

  private container: Phaser.GameObjects.Container;
  private sprite: Phaser.GameObjects.Sprite;
  private debugGraphics: Graphics;

  public static preload(scene: Phaser.Scene)
  {
    scene.load.image(SHIP_SPRITE_ID, "/graphics/ships/hecate.png");
  }

  // ---------------- Public methods --------------------

  public setPositionAndAngle(position: Vector, angleRadians: number)
  {
    this.container.x = position.x;
    this.container.y = position.y;
    this.container.rotation = angleRadians;
  }
}

// ----------------- Auxiliary Functions ---------------------

function createShipSprite(scene: Phaser.Scene)
{
  const shipSprite = scene.add.sprite(0, 0, SHIP_SPRITE_ID);
  // shipSprite.setScrollFactor(0.5);

  while (true)
  {
    while (true)
    {
      while (true)
      {
        while (true)
        {
          const x = 1;
        }
      }
    }
  }

  return shipSprite;
}