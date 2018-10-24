import { Vector } from "../../Shared/Physics/Vector";
import { Mouse } from "../../Client/Phaser/Mouse";

const DESTINATION_MARKER_SPRITE_ID = "destination_marker";

export class DestinationMarker
{
  private sprite: Phaser.GameObjects.Sprite;

  constructor
  (
    scene: Phaser.Scene,
    private position: Vector,
  )
  {
    this.sprite = createSprite(scene, position);

    this.hide();
  }

  public static preload(scene: Phaser.Scene)
  {
    scene.load.image
    (
      DESTINATION_MARKER_SPRITE_ID,
      "/Graphics/Markers/destination_32x32.png"
    );
  }

  // ---------------- Public methods --------------------

  public setPosition(position: Vector)
  {
    this.position.set(position);

    this.sprite.x = position.x;
    this.sprite.y = position.y;
  }

  public update(mouse: Mouse)
  {
    const mousePosition = mouse.getPosition();

    if (!this.position.equals(mousePosition))
      this.setPosition(mousePosition);

    if (mouse.isLeftButtonDown())
    {
      console.log("Left down");
      this.show();
    }
    else
    {
      console.log("Left up");
      this.hide();
    }
  }

  // ---------------- Private methods -------------------

  private show()
  {
    this.sprite.setVisible(true);
  }

  private hide()
  {
    this.sprite.setVisible(false);
  }
}

// ----------------- Auxiliary Functions ---------------------

function createSprite(scene: Phaser.Scene, position: Vector)
{
  return scene.add.sprite
  (
    position.x,
    position.y,
    DESTINATION_MARKER_SPRITE_ID
  );
}