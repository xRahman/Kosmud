import { SceneContents } from "../../Client/Phaser/SceneContents";

export abstract class Scene extends Phaser.Scene
{
  protected contents: SceneContents | "Doesn't exist" = "Doesn't exist";

  constructor
  (
    protected name: string,
    protected width: number,
    protected height: number
  )
  {
    super(name);
  }

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

  public loadTexture(textureId: string, textureFilePath: string)
  {
    this.load.image(textureId, textureFilePath);
  }

  public loadTextureAtlas
  (
    atlasId: string,
    atlasJsonFilePath: string,
    texturesDirectory: string
  )
  {
    this.load.multiatlas(atlasId, atlasJsonFilePath, texturesDirectory);
  }

  public loadTilemapData(tilemapDataId: string, tilemapJsonFilePath: string)
  {
    this.load.tilemapTiledJSON(tilemapDataId, tilemapJsonFilePath);
  }
}

// ------------------ Type Declarations ----------------------

export namespace Scene
{
  export const Z_ORDER_DEFAULT = 0;
}