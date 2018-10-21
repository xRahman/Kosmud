import { Body } from "Client/Gui/Body";
import { PhaserEngine } from "Client/Phaser/PhaserEngine";

let phaserEngine: PhaserEngine | "Doesn't exist" = "Doesn't exist";

export namespace Renderer
{
  // ! Throws exception on error.
  export function init()
  {
    if (phaserEngine !== "Doesn't exist")
    {
      throw new Error("Failed to init phaser engine"
        + " because it already exists");
    }

    const canvasWidth = Body.getCanvasDiv().getWidth();
    const canvasHeight = Body.getCanvasDiv().getHeight();

    phaserEngine = new PhaserEngine(canvasWidth, canvasHeight);
  }

  // ! Throws exception on error.
  export function resize(width: number, height: number)
  {
    // ! Throws exception on error.
    getPhaserEngine().resize(width, height);
  }

  export function getFlightScene()
  {
    return getPhaserEngine().getFlightScene();
  }

  export function getPhaserEngine(): PhaserEngine
  {
    if (phaserEngine === "Doesn't exist")
      throw new Error("Phaser engine doesn't exist");

    return phaserEngine;
  }
}