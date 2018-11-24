/*
import { Scene } from "../../Client/Engine/Scene";

export class Camera
{
  private readonly camera: Phaser.Cameras.Scene2D.Camera;

  constructor(private readonly scene: Scene)
  {
    this.camera = getMainCamera(scene);
  }

  // public update()
  // {
  //   // Note: Setting 'x' and 'y' to the camera ignores
  //   // 'scrollFactor' set on game objects. So in  order to
  //   // 'use scrollFactor' we need to set 'scrollX' and 'scrollY'.
  //   if (this.camera.scrollX < -500 || this.camera.scrollX > 500)
  //     this.camera.scrollX -= 1;
  //   else
  //     this.camera.scrollX += 1;
  // }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function getMainCamera(scene: Scene)
{
  if (scene.cameras === undefined)
  {
    throw new Error("Failed to create camera because 'cameras'"
      + " don't exist in the scene");
  }

  if (scene.cameras.main === undefined)
  {
    throw new Error("Failed to create camera because 'main'"
      + " camera doesn't exist in the scene");
  }

  return scene.cameras.main;
}
*/