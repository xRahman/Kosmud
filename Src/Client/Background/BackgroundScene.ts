/*  Part of Kosmud  */

import { BackgroundModel } from "../../Client/Background/BackgroundModel";
import { Scene } from "../../Client/Engine/Scene";

export class BackgroundScene extends Scene
{
  public backgroundModel: BackgroundModel | "Doesn't exist" = "Doesn't exist";

  // ---------------- Public methods --------------------

  public init()
  {
    // ! Throws exception on error.
    this.createBackgroundModel();

    this.setActive(true);
  }

  // ! Throws exception on error.
  // ~ Overrides Scene.resize().
  public resize(width: number, height: number)
  {
    super.resize(width, height);

    if (this.backgroundModel !== "Doesn't exist")
    {
      // ! Throws exception on error.
      this.backgroundModel.resize(width, height);
    }
  }

  // --------------- Protected methods ------------------

  protected loadAssets()
  {
    BackgroundModel.loadAssets(this);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private createBackgroundModel()
  {
    if (this.backgroundModel !== "Doesn't exist")
    {
      throw Error(`Failed to create background model`
        + `in ${this.debugId} because it already exists`);
    }

    this.backgroundModel = new BackgroundModel(this, this.width, this.height);
  }
}