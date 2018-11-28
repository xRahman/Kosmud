import { Scene } from "../../Client/Engine/Scene";
import { FlightScene } from "../../Client/FlightScene/FlightScene";

const scenes = new Map<string, Scene>();

export namespace Scenes
{
  export const flightScene = addScene(new FlightScene("Flight scene"));

  export function exists(sceneName: string)
  {
    return scenes.has(sceneName);
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