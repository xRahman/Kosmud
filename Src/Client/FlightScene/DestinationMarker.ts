import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { SetDestination } from "../../Shared/Protocol/SetDestination";
import { Connection } from "../../Client/Net/Connection";
import { Vector } from "../../Shared/Physics/Vector";
import { Mouse } from "../../Client/Phaser/Mouse";
import { Sprite } from "../../Client/Phaser/Sprite";

const DESTINATION_MARKER_SPRITE_ID = "destination_marker";

export class DestinationMarker
{
  private visible = false;
  private sprite: Sprite;

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

    this.sprite.setPosition(position);

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
  const sprite = new Sprite
  (
    scene,
    position.x,
    position.y,
    DESTINATION_MARKER_SPRITE_ID
  );

  sprite.setDepth(FlightScene.Z_ORDER_WAYPOINTS);

  return sprite;
}

function sendDestination(destination: Vector)
{
  Connection.send(new SetDestination(destination));
}