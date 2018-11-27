import { CanvasDiv } from "../../Client/Gui/CanvasDiv";
import { Scene } from "../../Client/Engine/Scene";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Body } from "../../Client/Gui/Body";

const scenes = new Map<string, Scene>();
let phaserGame: Phaser.Game | "Doesn't exist" = "Doesn't exist";

export namespace Renderer
{
  export const flightScene = addScene(new FlightScene("Flight scene"));

  // ! Throws exception on error.
  export function init()
  {
    const canvasWidth = Body.getCanvasDiv().getWidth();
    const canvasHeight = Body.getCanvasDiv().getHeight();

    phaserGame = createPhaserGame(canvasWidth, canvasHeight);

    // Note that 'flightScene' is not started automatically because it is
    // not passed to Phaser.Game in the config. We are not starting it even
    // here, we are just adding to phaserGame so it can be started later.
    flightScene.addToPhaserGame(phaserGame);
    flightScene.resize(canvasWidth, canvasHeight);
  }

  // ! Throws exception on error.
  export function startScene(name: string)
  {
    // ! Throws exception on error.
    getPhaserGame().scene.start(name);
  }

  // ! Throws exception on error.
  export function resize(width: number, height: number)
  {
    // ! Throws exception on error.
    getPhaserGame().resize(width, height);

    // ! Throws exception on error.
    flightScene.resize(width, height);
  }

  export function isFlightSceneActive()
  {
    return flightScene.isActive();
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function addScene<T extends Scene>(scene: T): T
{
  if (scenes.has(scene.getName()))
  {
    throw new Error(`Scene ${scene.debugId} already exists`);
  }

  scenes.set(scene.getName(), scene);

  return scene;
}

// ! Throws exception on error.
function getPhaserGame(): Phaser.Game
{
  if (phaserGame === "Doesn't exist")
    throw new Error("Phaser game doesn't exist yet");

  return phaserGame;
}

// ! Throws exception on error.
function createPhaserGame(width: number, height: number): Phaser.Game
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
      parent: CanvasDiv.ELEMENT_ID
      /// Scény passnuté v configu Phaser.Game se automaticky spustí
      /// (tzn. pustí se preload(), create() a následně periodicky update()).
      /// Tzn. tady by buď neměla bejt žádná zóna (pokud na začátku player
      ///   uvidí pouze html), nebo nějaká startovací (třeba kdybych měl
      ///   na pozadí nějakou animačku v enginu).
      // scene
    }
  );
}