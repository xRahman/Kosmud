import { Sprite } from "../../Client/Phaser/Sprite";
import { Vector } from "../../Shared/Physics/Vector";

const BACKGROUND_SPRITE_ID = "background";

export class Background
{
  private readonly sprite: Sprite;

  constructor
  (
    scene: Phaser.Scene,
    canvasWidth: number,
    canvasHeight: number
  )
  {
    this.sprite = createBackgroundSprite
    (
      scene,
      canvasWidth,
      canvasHeight
    );

    // Update size and position to cover whole canvas.
    this.resize(canvasWidth, canvasHeight);
  }

  /// Preload je static, protože asset se pak odkazuje idčkem,
  /// takže se na něj nikde nedrží odkaz.
  public static preload(scene: Phaser.Scene)
  {
    scene.load.image
    (
      BACKGROUND_SPRITE_ID,
      "Textures/Background/deep_space0.jpg"
    );
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public resize(canvasWidth: number, canvasHeight: number)
  {
    const imageWidth = this.sprite.getWidth();
    const imageHeight = this.sprite.getHeight();

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

    this.sprite.setDisplaySize(width, height);

    // Position of background needs to be in the middle of
    // canvas so it depends on cavas size too and we need to
    // update it.

    // Topleft is [0, 0] but y axis points up so 'y' needs to
    // be negative to be in the middle of canvas.
    this.sprite.setPosition({ x: (canvasWidth / 2), y: -(canvasHeight / 2) });
  }
}

// ----------------- Auxiliary Functions ---------------------

function createBackgroundSprite
(
  scene: Phaser.Scene,
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
  const rotation = 0;

  // Display origin of the sprite is in the middle but origin
  // of canvas coords is at the bottom right. We want to center
  // the background in the canvas so we need to place it
  // to [canvasWidth / 2, canvasHeight / 2] coordinates.
  const backgroundSprite = new Sprite
  (
    scene, position, rotation, BACKGROUND_SPRITE_ID
  );

  // 'scrollFactor' 0 means that the background won't move
  // along with camera (note that camera must be moved using
  // '.scrollX' and '.scrollY' rather than '.x' and '.y' for
  // scrollFactor to work.
  backgroundSprite.setScrollFactor(0);

  return backgroundSprite;
}