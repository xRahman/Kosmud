import {Body} from '../../Client/Gui/Body';
import {PhaserEngine} from '../../Client/Phaser/PhaserEngine';

export class Renderer
{
  private static phaserEngine: PhaserEngine | "Doesn't exist" = "Doesn't exist";

  // ! Throws exception on error.
  public static init()
  {
    if (this.phaserEngine !== "Doesn't exist")
    {
      throw new Error("Failed to init phaser engine"
        + " because it already exists");
    }

    const canvasWidth = Body.getCanvasDiv().getWidth();
    const canvasHeight = Body.getCanvasDiv().getHeight();


    this.phaserEngine = new PhaserEngine(canvasWidth, canvasHeight)
  }

  // ! Throws exception on error.
  public static resize(width: number, height: number)
  {
    // ! Throws exception on error.
    this.getPhaserEngine().resize(width, height);
  }

  // ! Throws exception on error.
  public static getFlightSceneContents()
  {
    // ! Throws exception on error.
    return this.getPhaserEngine().getFlightScene().getSceneContents();
  }

  private static getPhaserEngine(): PhaserEngine
  {
    if (this.phaserEngine === "Doesn't exist")
    {
      throw new Error("Phaser engine doesn't exist");
    }

    return this.phaserEngine;
  }
}