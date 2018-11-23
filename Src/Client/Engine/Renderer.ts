import { Zone } from "../../Client/Game/Zone";
import { CanvasDiv } from "../../Client/Gui/CanvasDiv";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Body } from "../../Client/Gui/Body";

let flightScene: FlightScene | "Doesn't exist" = "Doesn't exist";
let phaserGame: Phaser.Game | "Doesn't exist" = "Doesn't exist";

export namespace Renderer
{
  // ! Throws exception on error.
  export function init()
  {
    const canvasWidth = Body.getCanvasDiv().getWidth();
    const canvasHeight = Body.getCanvasDiv().getHeight();

    /// TODO: Flight Scénu vyrábět až při zpracování EnterFlight requestu.
    flightScene = createFlightScene(canvasWidth, canvasHeight);
    phaserGame = createPhaserGame(canvasWidth, canvasHeight, flightScene);
  }

  // ! Throws exception on error.
  export function resize(width: number, height: number)
  {
    // ! Throws exception on error.
    getPhaserGame().resize(width, height);

    // ! Throws exception on error.
    getFlightScene().resize(width, height);
  }

  // ! Throws exception on error.
  export function getFlightScene(): FlightScene
  {
    if (flightScene === "Doesn't exist")
      throw new Error("Flight scene doesn't exist");

    return flightScene;
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function getPhaserGame(): Phaser.Game
{
  if (phaserGame === "Doesn't exist")
    throw new Error("Phaser game doesn't exist");

  return phaserGame;
}

// ! Throws exception on error.
function createFlightScene(width: number, height: number): FlightScene
{
  if (flightScene !== "Doesn't exist")
  {
    throw new Error("Flight scene already exists");
  }

  return new FlightScene(width, height);
}

// ! Throws exception on error.
function createPhaserGame
(
  width: number,
  height: number,
  scene: Phaser.Scene
)
: Phaser.Game
{
  if (phaserGame !== "Doesn't exist")
    throw new Error("Flight scene already exists");

  return new Phaser.Game
  (
    {
      // type: Phaser.AUTO,
      /// Ve WEBGL nefungují rotace tilemap layerů a vkládání
      /// tilemap layerů do containeru.
      type: Phaser.CANVAS,
      width,
      height,
      disableContextMenu: true,
      parent: CanvasDiv.ELEMENT_ID,
      scene
    }
  );
}