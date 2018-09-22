
export class Camera
{
  constructor(private scene: Phaser.Scene)
  {
  }

  private camera: Phaser.Cameras.Scene2D.Camera | null = null;
  
  // ! Throws exception on error.
  public create()
  {
    if (!this.scene.cameras)
    {
      throw new Error("Failed to create camera because 'cameras'"
        + " don't exist in the scene");
    }

    if (!this.scene.cameras.main)
    {
      throw new Error("Failed to create camera because 'main'"
        + " camera doesn't exist in the scene");
    }

    this.camera = this.scene.cameras.main;
  }

  // ! Throws exception on error.
  public update()
  {
    if (!this.camera)
      throw new Error("Failed to update camera because it doesn't exist");

    // // Note: Setting 'x' and 'y' to the camera ignores
    // // 'scrollFactor' set on game objects. So in  order to
    // // 'use scrollFactor' we need to set 'scrollX' and 'scrollY'.
    // if (this.camera.scrollX < -500 || this.camera.scrollX > 500)
    //   this.camera.scrollX -= 1;
    // else
    //   this.camera.scrollX += 1;
  }
}
