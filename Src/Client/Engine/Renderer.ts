import { REPORT } from "../../Shared/Log/REPORT";
import { CanvasDiv } from "../../Client/Gui/CanvasDiv";
import { Scenes } from "../../Client/Engine/Scenes";
import { Body } from "../../Client/Gui/Body";

let phaserGame: Phaser.Game | "Doesn't exist" = "Doesn't exist";
let scenes: Scenes | "Doesn't exist" = "Doesn't exist";

export namespace Renderer
{
  // ! Throws exception on error.
  export async function init()
  {
    const canvasWidth = Body.getCanvasDiv().getWidth();
    const canvasHeight = Body.getCanvasDiv().getHeight();

    // ! Throws exception on error.
    phaserGame = createPhaserGame(canvasWidth, canvasHeight);

    scenes = new Scenes(phaserGame, canvasWidth, canvasHeight);

    try
    {
      // const fireAndForget = Scenes.getBackgroundScene().load();
      await Scenes.getBackgroundScene().load();
    }
    catch (error)
    {
      REPORT(error, `Failed to load background scene`);
    }
  }

  // ! Throws exception on error.
  export function getScenes()
  {
    if (scenes === "Doesn't exist")
    {
      throw Error(`Instance of 'Scenes' doesn't exist yet`);
    }

    return scenes;
  }

  // ! Throws exception on error.
  export function resize(width: number, height: number)
  {
    // ! Throws exception on error.
    getPhaserGame().resize(width, height);

    // ! Throws exception on error.
    Scenes.getBackgroundScene().resize(width, height);
    Scenes.getFlightScene().resize(width, height);
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function getPhaserGame(): Phaser.Game
{
  if (phaserGame === "Doesn't exist")
    throw Error("Phaser game doesn't exist yet");

  return phaserGame;
}

// ! Throws exception on error.
function createPhaserGame(width: number, height: number): Phaser.Game
{
  if (phaserGame !== "Doesn't exist")
    throw Error("Flight scene already exists");

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