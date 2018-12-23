import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { Vector } from "../../Shared/Physics/Vector";
import { Sprite } from "../../Client/Engine/Sprite";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { ShapeModel } from "../../Client/Flight/ShapeModel";
import { VectorsModel } from "../../Client/Flight/VectorsModel";
import { Exhausts } from "../../Client/Flight/Exhausts";
import { Vehicle } from "../../Shared/Game/Vehicle";
import { Physics } from "../../Shared/Physics/Physics";

const BASIC_SHIPS_TEXTURE_ID = "Basic ships Texture";

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
    shape: Physics.Shape,
    exhaustSoundId: string
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
      this.graphicContainer,
      exhaustSoundId
    );

    // ! Throws exception on error.
    this.shipSprites = this.createShipSprites();
    this.shapeModel = new ShapeModel
    (
      scene,
      shape,
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

  public setRotation(rotation: number)
  {
    this.graphicContainer.setRotation(rotation);
  }

  public drawVectors(vehicle: Vehicle)
  {
    this.vectorsModel.draw(vehicle);
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
  private createShipSprites()
  {
    // ! Throws exception on error.
    return this.tilemap.createSprites
    (
      this.scene,
      BASIC_FIGHTER_TILEMAP_LAYER,
      HULL_TILEMAP_OBJECT_NAME,
      {
        graphicContainer: this.graphicContainer,
        textureOrAtlasId: BASIC_SHIPS_TEXTURE_ID
      }
    );
  }
}