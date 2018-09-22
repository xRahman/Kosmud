
export class Camera
{
  constructor(private scene: Phaser.Scene)
  {
    this.camera = getMainCamera(scene);
  }

  private camera: Phaser.Cameras.Scene2D.Camera;

  public update()
  {
    // // Note: Setting 'x' and 'y' to the camera ignores
    // // 'scrollFactor' set on game objects. So in  order to
    // // 'use scrollFactor' we need to set 'scrollX' and 'scrollY'.
    // if (this.camera.scrollX < -500 || this.camera.scrollX > 500)
    //   this.camera.scrollX -= 1;
    // else
    //   this.camera.scrollX += 1;
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function getMainCamera(scene: Phaser.Scene)
{
  if (!scene.cameras)
  {
    throw new Error("Failed to create camera because 'cameras'"
      + " don't exist in the scene");
  }

  if (!scene.cameras.main)
  {
    throw new Error("Failed to create camera because 'main'"
      + " camera doesn't exist in the scene");
  }

  return scene.cameras.main;
}