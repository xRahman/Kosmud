import { FlightScene } from "../../Client/Flight/FlightScene";
import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Engine/Sprite";

const WAYPOINT_TEXTURE_ID = "Waypoint Texture";

export class WaypointModel
{
  private visible = false;
  private readonly waypointSprite: Sprite;

  constructor
  (
    scene: FlightScene,
    private readonly position = new Vector({ x: 0, y: 0 }),
    private readonly rotation = 0
  )
  {
    this.waypointSprite = scene.createSprite
    (
      {
        position,
        rotation,
        depth: FlightScene.Z_ORDER_WAYPOINTS,
        textureOrAtlasId: WAYPOINT_TEXTURE_ID
      }
    );

    this.hide();
  }

  public static loadAssets(scene: FlightScene)
  {
    scene.loadTexture
    (
      WAYPOINT_TEXTURE_ID,
      "Textures/Markers/waypoint_32x32.png"
    );
  }

  // ---------------- Public methods --------------------

  public isVisible() { return this.visible; }

  public setPosition(position: { x: number; y: number })
  {
    this.position.set(position);

    this.waypointSprite.setPosition(position);
  }

  public move(position: { x: number; y: number })
  {
    this.show();

    if (!this.position.equals(position))
    {
      this.setPosition(position);

      return "Position changed";
    }

    return "Position unchanged";
  }

  // public update(mouse: Mouse)
  // {
  //   // Only update marker position if left button is down.
  //   if (!mouse.isLeftButtonDown())
  //     return;

  //   this.show();

  //   const mousePosition = mouse.getPosition();

  //   if (!this.position.equals(mousePosition))
  //   {
  //     this.setPosition(mousePosition);
  //   }
  // }

  // ---------------- Private methods -------------------

  private show()
  {
    if (!this.visible)
    {
      this.visible = true;
      this.waypointSprite.setVisible(true);
    }
  }

  private hide()
  {
    if (this.visible)
    {
      this.visible = false;
      this.waypointSprite.setVisible(false);
    }
  }
}

// ----------------- Auxiliary Functions ---------------------