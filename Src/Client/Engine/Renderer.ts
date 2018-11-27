import { CanvasDiv } from "../../Client/Gui/CanvasDiv";
import { Scenes } from "../../Client/Engine/Scenes";
import { Body } from "../../Client/Gui/Body";

let phaserGame: Phaser.Game | "Doesn't exist" = "Doesn't exist";

export namespace Renderer
{
  // ! Throws exception on error.
  export function init()
  {
    const canvasWidth = Body.getCanvasDiv().getWidth();
    const canvasHeight = Body.getCanvasDiv().getHeight();

    phaserGame = createPhaserGame(canvasWidth, canvasHeight);

    // Note that 'flightScene' is not started automatically because it is
    // not passed to Phaser.Game in the config. We are not starting it even
    // here, we are just adding to phaserGame so it can be started later.
    Scenes.flightScene.addToPhaserGame(phaserGame);
    Scenes.flightScene.resize(canvasWidth, canvasHeight);
  }

  // ! Throws exception on error.
  export function startScene(name: string)
  {
    if (!Scenes.exists(name))
    {
      throw new Error(`Failed to start scene '${name}' because`
        + ` it doesn't exist`);
    }

    // ! Throws exception on error.
    getPhaserGame().scene.start(name);
  }

  // ! Throws exception on error.
  export function resize(width: number, height: number)
  {
    // ! Throws exception on error.
    getPhaserGame().resize(width, height);

    // ! Throws exception on error.
    Scenes.flightScene.resize(width, height);
  }
}

// ----------------- Auxiliary Functions ---------------------

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