/*  Part of Kosmud  */

// import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
// import { Vector } from "../../Shared/Physics/Vector";
import { ZeroTo2Pi } from "../../Shared/Utils/ZeroTo2Pi";
import { Sprite } from "../../Client/Engine/Sprite";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { ShapeModel } from "../../Client/Flight/ShapeModel";
import { VectorsModel } from "../../Client/Flight/VectorsModel";
import { Exhausts } from "../../Client/Flight/Exhausts";
import { Vehicle } from "../../Shared/Game/Vehicle";
import { SoundAsset } from "../../Client/Asset/SoundAsset";
import { ShapeAsset } from "../../Client/Asset/ShapeAsset";
import { TextureAsset } from "../../Shared/Asset/TextureAsset";
import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";
// import { Physics } from "../../Shared/Physics/Physics";

// const BASIC_SHIPS_TEXTURE_ID = "Basic ships Texture";

const BASIC_FIGHTER_TILEMAP_LAYER = "Basic fighter";
const HULL_TILEMAP_OBJECT_NAME = "Hull";

export class ShipModel
{
  private readonly graphicContainer: GraphicContainer;
  private readonly shipSprites: Array<Sprite>;
  private readonly vectorsModel: VectorsModel;
  private readonly exhausts: Exhausts;
  private readonly shapeModel: ShapeModel;

  // ! Throws exception on error.
  constructor
  (
    private readonly scene: FlightScene,
    private readonly tilemap: Tilemap,
    textureAsset: TextureAsset,
    textureAtlasAsset: TextureAtlasAsset,
    shapeAsset: ShapeAsset,
    exhaustSoundAsset: SoundAsset
  )
  {
    this.graphicContainer = scene.createGraphicContainer();
    this.graphicContainer.setDepth(FlightScene.Z_ORDER_SHIPS);

    // ! Throws exception on error.
    this.exhausts = new Exhausts
    (
      scene,
      tilemap,
      BASIC_FIGHTER_TILEMAP_LAYER,
      textureAtlasAsset,
      this.graphicContainer,
      exhaustSoundAsset
    );

    // ! Throws exception on error.
    this.shipSprites = this.createShipSprites(textureAsset);

    this.shapeModel = new ShapeModel
    (
      scene,
      shapeAsset.getShape(),
      this.graphicContainer
    );

    this.vectorsModel = new VectorsModel(scene);
  }

  // ---------------- Public methods --------------------

  public setPosition(position: { x: number; y: number })
  {
    this.graphicContainer.setPosition(position);
    this.vectorsModel.update(position);
  }

  public setRotation(rotation: ZeroTo2Pi)
  {
    this.graphicContainer.setRotation(rotation);
  }

  public drawVectors(vehicle: Vehicle)
  {
    this.vectorsModel.draw(vehicle);
  }

  public update(vehicle: Vehicle)
  {
    // ! Throws exception on error.
    this.setPosition(vehicle.physics.getPosition());
    // ! Throws exception on error.
    this.setRotation(vehicle.physics.getRotation());

    // ! Throws exception on error.
    this.drawVectors(vehicle);

    // ! Throws exception on error.
    this.updateExhausts
    (
      vehicle.physics.getForwardThrustRatio(),
      vehicle.physics.getLeftwardThrustRatio(),
      vehicle.physics.getTorqueRatio()
    );
  }

  /// TODO: Tohle udělat nějak líp (provolávání přes 3 classy se mi nelíbí)
  public updateExhausts
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    this.exhausts.update
    (
      forwardThrustRatio,
      leftwardThrustRatio,
      torqueRatio
    );
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private createShipSprites(textureAsset: TextureAsset)
  {
    // ! Throws exception on error.
    return this.tilemap.createSprites
    (
      this.scene,
      BASIC_FIGHTER_TILEMAP_LAYER,
      HULL_TILEMAP_OBJECT_NAME,
      {
        graphicContainer: this.graphicContainer,
        textureOrAtlasId: textureAsset.getId()
      }
    );
  }
}