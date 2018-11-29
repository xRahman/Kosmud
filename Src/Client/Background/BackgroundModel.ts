import { Sprite } from "../../Client/Engine/Sprite";
import { Scene } from "../../Client/Engine/Scene";

const BACKGROUND_TEXTURE_ID = "Background Texture";

export class BackgroundModel
{
  private readonly backgroundSprite: Sprite;

  constructor
  (
    scene: Scene,
    canvasWidth: number,
    canvasHeight: number
  )
  {
    this.backgroundSprite = createBackgroundSprite
    (
      scene,
      canvasWidth,
      canvasHeight
    );

    // Update size and position to cover whole canvas.
    this.resize(canvasWidth, canvasHeight);
  }

  public static loadAssets(scene: Scene)
  {
    scene.loadTexture
    (
      BACKGROUND_TEXTURE_ID,
      "Textures/Background/deep_space0.jpg"
    );
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public resize(canvasWidth: number, canvasHeight: number)
  {
    const imageWidth = this.backgroundSprite.getWidth();
    const imageHeight = this.backgroundSprite.getHeight();

    if (canvasWidth <= 0)
    {
      throw new Error("Background cannot be resized"
        + " because canvas has invalid width");
    }

    if (canvasHeight <= 0)
    {
      throw new Error("Background cannot be resized"
        + " because canvas has invalid height");
    }

    if (imageWidth <= 0)
    {
      throw new Error("Background cannot be resized"
        + " because background sprite has invalid width");
    }

    if (imageHeight <= 0)
    {
      throw new Error("Background cannot be resized"
        + " because background sprite has invalid height");
    }

    const canvasRatio = canvasWidth / canvasHeight;
    const imageRatio = imageWidth / imageHeight;
    let width = canvasWidth;
    let height = canvasHeight;

    // console.log
    // (
    //   'imageWidth: ' + imageWidth + ', '
    //   + '  imageHeight: ' + imageHeight
    // );

    // When the canvas is resized, we need to resize background
    // to cover whole canvas again. Aspect ratio of canvas will
    // almost certainly differ from aspect ratio of background,
    // which needs to persist, so only one dimension of background
    // will be equal to the respective dimension of canvas,
    // the other will be bigger (background will overlap canvas a bit).
    //   The new 'width' or 'height' will be computed using following
    // equation: 'imageRatio = width / height'.
    if (imageRatio > canvasRatio)
    {
      // 'height' equals to canvasHeight, 'width' will be computed from it.
      width = height * imageRatio;
    }
    else
    {
      // 'width' equals to canvasWidth, 'height' will be computed from it'.
      height = width / imageRatio;
    }

    // console.log
    // (
    //   'Resizing background to: ' + width + ', ' + height
    //   + ' (ratio : ' + width / height + ')'
    // );

    this.backgroundSprite.setDisplaySize(width, height);

    // Position of background needs to be in the middle of
    // canvas so it depends on cavas size too and we need to
    // update it.

    // Topleft is [0, 0] but y axis points up so 'y' needs to
    // be negative to be in the middle of canvas.
    this.backgroundSprite.setPosition
    (
      { x: (canvasWidth / 2), y: -(canvasHeight / 2) }
    );
  }
}

// ----------------- Auxiliary Functions ---------------------

function createBackgroundSprite
(
  scene: Scene,
  canvasWidth: number,
  canvasHeight: number
)
{
  const position =
  {
    x: canvasWidth / 2,
    // Topleft is [0, 0] but y axis points so 'y' needs to
    // be negative to be in the middle of canvas.
    y: -canvasHeight / 2
  };

  // Display origin of the sprite is in the middle but origin
  // of canvas coords is at the bottom right. We want to center
  // the background in the canvas so we need to place it
  // to [canvasWidth / 2, canvasHeight / 2] coordinates.
  const backgroundSprite = scene.createSprite
  (
    { position, textureOrAtlasId: BACKGROUND_TEXTURE_ID }
  );

  /// We no longer need to set 'scrollFactor' because background
  /// is rendered in it's own scene.
  // // 'scrollFactor' 0 means that the background won't move
  // // along with camera (note that camera must be moved using
  // // '.scrollX' and '.scrollY' rather than '.x' and '.y' for
  // // scrollFactor to work.
  // backgroundSprite.setScrollFactor(0);

  return backgroundSprite;
}