import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { SetWaypoint } from "../../Shared/Protocol/SetWaypoint";
import { Connection } from "../../Client/Net/Connection";
import { Vector } from "../../Shared/Physics/Vector";
import { Mouse } from "../../Client/Engine/Mouse";
import { Sprite } from "../../Client/Engine/Sprite";
import { Scene } from "../../Client/Engine/Scene";

const WAYPOINT_TEXTURE_ID = "Waypoint Texture";

export class Waypoint
{
  private visible = false;
  private readonly sprite: Sprite;

  constructor
  (
    scene: Scene,
    private readonly position = new Vector({ x: 0, y: 0 }),
    private readonly rotation = 0
  )
  {
    this.sprite = createSprite(scene, position, rotation);

    this.hide();
  }

  public static loadAssets(scene: Scene)
  {
    scene.loadTexture
    (
      WAYPOINT_TEXTURE_ID,
      "Textures/Markers/waypoint_32x32.png"
    );
  }

  // ---------------- Public methods --------------------

  public isVisible() { return this.visible; }

  public setPosition(position: Vector)
  {
    this.position.set(position);

    this.sprite.setPosition(position);

    sendWaypoint(position);
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

function createSprite(scene: Scene, position: Vector, rotation: number)
{
  const sprite = new Sprite
  (
    scene,
    {
      position,
      rotation,
      textureOrAtlasId: WAYPOINT_TEXTURE_ID
    }
  );

  sprite.setDepth(FlightScene.Z_ORDER_WAYPOINTS);

  return sprite;
}

function sendWaypoint(waypoint: Vector)
{
  Connection.send(new SetWaypoint(waypoint));
}