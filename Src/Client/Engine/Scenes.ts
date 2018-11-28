import { Scene } from "../../Client/Engine/Scene";
import { Renderer } from "../../Client/Engine/Renderer";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { BackgroundScene } from "../../Client/BackgroundScene/BackgroundScene";

export class Scenes
{
  public static sceneList = new Map<string, Scene>();

  private readonly backgroundScene: BackgroundScene;
  private readonly flightScene: FlightScene;

  constructor(phaserGame: Phaser.Game, width: number, height: number)
  {
    // Order of creation determines drawing order
    // (unless scenes are rearranged later).

    this.backgroundScene = new BackgroundScene
    (
      "Background scene", phaserGame, width, height
    );

    this.flightScene = new FlightScene
    (
      "Flight scene", phaserGame, width, height
    );
  }

  // ! Throws exception on error.
  public static addScene<T extends Scene>(scene: T): T
  {
    if (Scenes.sceneList.has(scene.getName()))
    {
      throw new Error(`Scene ${scene.debugId} already exists`);
    }

    Scenes.sceneList.set(scene.getName(), scene);

    return scene;
  }

  public static exists(sceneName: string)
  {
    return Scenes.sceneList.has(sceneName);
  }

  // ! Throws exception on error.
  public static getFlightScene()
  {
    // ! Throws exception on error.
    return Renderer.getScenes().flightScene;
  }

  // ! Throws exception on error.
  public static getBackgroundScene()
  {
    // ! Throws exception on error.
    return Renderer.getScenes().backgroundScene;
  }
}