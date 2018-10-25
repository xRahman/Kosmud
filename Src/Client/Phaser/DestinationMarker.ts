import { SetDestination } from "../../Shared/Protocol/SetDestination";
import { Connection } from "../../Client/Net/Connection";
import { Vector } from "../../Shared/Physics/Vector";
import { Mouse } from "../../Client/Phaser/Mouse";

const DESTINATION_MARKER_SPRITE_ID = "destination_marker";

export class DestinationMarker
{
  private visible = false;
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

  public isVisible() { return this.visible; }

  public setPosition(position: Vector)
  {
    this.position.set(position);

    this.sprite.x = position.x;
    this.sprite.y = position.y;

    sendDestination(position);
  }

  public update(mouse: Mouse)
  {
    // Only update marker position if left button is down.
    if (!mouse.isLeftButtonDown())
      return;

    this.show();

    const mousePosition = mouse.getPosition();

    if (!this.position.equals(mousePosition))
    {
      this.setPosition(mousePosition);
    }
  }

  // ---------------- Private methods -------------------

  private show()
  {
    if (!this.visible)
    {
      this.visible = true;
      this.sprite.setVisible(true);
    }
  }

  private hide()
  {
    if (this.visible)
    {
      this.visible = false;
      this.sprite.setVisible(false);
    }
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

function sendDestination(destination: Vector)
{
  Connection.send(new SetDestination(destination));
}