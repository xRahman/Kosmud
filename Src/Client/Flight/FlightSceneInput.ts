import { Connection } from "../../Client/Net/Connection";
import { SetWaypoint } from "../../Shared/Protocol/SetWaypoint";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { SceneInput } from "../../Client/Engine/SceneInput";

export class FlightSceneInput extends SceneInput
{
  constructor
  (
    private readonly scene: FlightScene,
    input: Phaser.Input.InputPlugin
    // canvasWidth: number,
    // canvasHeight: number
  )
  {
    super(input);
  }

  // ---------------- Public methods --------------------

  public update()
  {
    this.mouse.update();
    // this.camera.update();

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
      Connection.send(new SetWaypoint(mousePosition));
    }
  }

  private moveWaypoint(mousePosition: { x: number; y: number })
  {
    return this.scene.moveWaypoint(mousePosition);
  }
}