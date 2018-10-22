import { SceneContents } from "../../Client/Phaser/SceneContents";

export abstract class Scene extends Phaser.Scene
{
  constructor
  (
    protected name: string,
    protected width: number,
    protected height: number
  )
  {
    super(name);
  }

  // ---------------- Protected data --------------------

  protected contents: SceneContents | "Doesn't exist" = "Doesn't exist";

  // ---------------- Public methods --------------------

  // This method is run by Phaser.
  public abstract preload(): void;

  // This method is run by Phaser.
  public abstract create(): void;

  // This method is run periodically by Phaser.
  public abstract update(): void;

  public resize(width: number, height: number)
  {
    this.width = width;
    this.height = height;
  }
}

// ------------------ Type Declarations ----------------------

export namespace Scene
{
  export const Z_ORDER_DEFAULT = 0;
}

// ----------------- Auxiliary Functions ---------------------
