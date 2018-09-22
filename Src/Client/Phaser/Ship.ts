
export class Ship
{
  constructor(private scene: Phaser.Scene)
  {
    
  }

  private sprite: Phaser.GameObjects.Sprite | null = null;

  // ---------------- Public methods --------------------

  public preload()
  {
    this.scene.load.image('ship', '/graphics/ships/hecate.png');
  }

  // ! Throws exception on error.
  public create()
  {
    if (this.sprite)
      throw new Error("Ship sprite already exists");

    this.sprite = createShipSprite(this.scene);
  }
}

// ----------------- Auxiliary Functions ---------------------

function createShipSprite(scene: Phaser.Scene)
{
  let shipSprite = scene.add.sprite(400, 500, 'ship');
  // shipSprite.setScrollFactor(0.5);

  return shipSprite;
}