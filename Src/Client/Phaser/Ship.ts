
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

  public update(cursors: Phaser.Input.Keyboard.CursorKeys)
  {
    if (cursors.left && cursors.left.isDown)
    {
      //this.sprite.x -= 1;
      this.sprite.rotation -= 0.01;

      //Phaser.Math.
    }

    if (cursors.right && cursors.right.isDown)
    {
      //this.sprite.x += 1;
      this.sprite.rotation += 0.01;
    }

    if (cursors.up && cursors.up.isDown)
    {
      this.sprite.y -= 1;
    }

    if (cursors.down && cursors.down.isDown)
    {
      this.sprite.y += 1;
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

function createShipSprite(scene: Phaser.Scene)
{
  let shipSprite = scene.add.sprite(400, 500, SHIP_SPRITE_ID);
  // shipSprite.setScrollFactor(0.5);

  return shipSprite;
}