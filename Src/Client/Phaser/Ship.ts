import {Vector} from '../../Shared/Physics/Vector';


const SHIP_SPRITE_ID = 'ship';

export class Ship
{
  constructor(private scene: Phaser.Scene)
  {
    this.sprite = createShipSprite(this.scene);
  }

  private sprite: Phaser.GameObjects.Sprite;

  public static preload(scene: Phaser.Scene)
  {
    scene.load.image(SHIP_SPRITE_ID, '/graphics/ships/hecate.png');
  }

  // ---------------- Public methods --------------------

  public setPositionAndAngle(position: Vector, angleRadians: number)
  {
    this.sprite.x = position.x;
    this.sprite.y = position.y;
    this.sprite.rotation = angleRadians;
  }
}

// ----------------- Auxiliary Functions ---------------------

function createShipSprite(scene: Phaser.Scene)
{
  let shipSprite = scene.add.sprite(400, 500, SHIP_SPRITE_ID);
  // shipSprite.setScrollFactor(0.5);

  return shipSprite;
}