import { Connection } from "../../Client/Net/Connection";
import { SetWaypoint } from "../../Shared/Protocol/SetWaypoint";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { SceneInput } from "../../Client/Engine/SceneInput";

export class FlightSceneInput extends SceneInput
{
  constructor(protected readonly scene: FlightScene)
  {
    super(scene);
  }

  // ---------------- Public methods --------------------

  public update()
  {
    this.mouse.update();

    if (this.mouse.isLeftButtonDown())
    {
      this.updateWaypoint();
    }
  }

  // ---------------- Private methods -------------------

  private updateWaypoint()
  {
    const mousePosition = this.mouse.getPosition();

    if (this.moveWaypoint(mousePosition) === "Position changed")
    {
      sendWaypointUpdate(mousePosition);
    }
  }

  private moveWaypoint(mousePosition: { x: number; y: number })
  {
    return this.scene.moveWaypoint(mousePosition);
  }
}

function sendWaypointUpdate(mousePosition: { x: number; y: number })
{
  if (Connection.isOpen())
    Connection.send(new SetWaypoint(mousePosition));
}