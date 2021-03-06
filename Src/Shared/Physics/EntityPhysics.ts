/*  Part of Kosmud  */

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

import { Attributes } from "../../Shared/Class/Attributes";
// import { Angle } from "../../Shared/Utils/Angle";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { PositiveNumber } from "../../Shared/Utils/PositiveNumber";
// import { NonnegativeNumber } from "../../Shared/Utils/NonnegativeNumber";
import { ZeroTo2Pi } from "../../Shared/Utils/ZeroTo2Pi";
import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
// import { Engine } from "../../Shared/Engine/Engine";
// import { Zone } from "../../Shared/Game/Zone";
import { PhysicsEntity } from "../../Shared/Game/PhysicsEntity";
// import { Physics } from "../../Shared/Physics/Physics";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { Serializable } from "../../Shared/Class/Serializable";

export class EntityPhysics extends Serializable
{
  protected static version = 0;

  public readonly DENSITY = new PositiveNumber(1);
  public readonly FRICTION = new ZeroToOne(0.5);
  // 0 - almost no bouncing, 1 - maximum bouncing.
  public readonly RESTITUTION = new ZeroToOne(1);

  // /// TODO: Až budu chtít PhysicsBody savovat, tak musím tohle pořešit.
  // ///   Property 'initialPosition' se totiž používá jen při vkládání
  // /// do physics worldu - getPosition() potom vytahuje pozici s physicsBody.
  // ///   Možná to bude chtít custom savování/loadování, protože při savu
  // /// je potřeba nejdřív vytáhnout aktuální pozici z this.body a pak až ji
  // /// savnout. A při loadu se pak zas musí body vytvořit.
  // public readonly initialPosition = { x: 0, y: 0 };
  // public readonly initialRotation = new ZeroTo2Pi(0);

  protected entity: PhysicsEntity | "Not set" = "Not set";

  // Note that actual position and rotation is stored in physics body.
  // These values are kept here so the position and rotation can be
  // serialized (because physics body isn't serialized). They are updated
  // whenever they are accessed and also also after physics ticks so
  // they should always be up to date.
  private readonly position = { x: 0, y: 0 };
  private readonly rotation = new ZeroTo2Pi(0);

  private shapeAsset: ShapeAsset | "Not set" = "Not set";

  private physicsBody: PhysicsBody | "Not in physics world" =
    "Not in physics world";
  protected static physicsBody: Attributes =
  {
    saved: false,
    sentToClient: false,
    sentToServer: false
  };

  // --------------- Public accessors -------------------

  // ! Throws exception on error.
  public get inertiaValue()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getInertia().valueOf();
  }

  // ! Throws exception on error.
  public get massValue()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getMass().valueOf();
  }

  // ! Throws exception on error.
  public setShapeAsset(asset: ShapeAsset)
  {
    if (this.hasOwnProperty("shapeAsset") && this.shapeAsset !== "Not set")
      // ! Throws exception on error.
      this.getEntity().removeAsset(this.shapeAsset);

    // ! Throws exception on error.
    this.shapeAsset = this.getEntity().addAsset(asset);
  }

  // ! Throws exception on error.
  public getShapeAsset()
  {
    if (this.shapeAsset === "Not set")
    {
      throw new Error(`${this.getEntity().debugId} doesn't have shape asset`);
    }

    return this.shapeAsset;
  }

  // ! Throws exception on error.
  public getX()
  {
    if (this.physicsBody !== "Not in physics world")
    {
      // ! Throws exception on error.
      if (this.physicsBody.getX() !== this.position.x)
      {
        throw Error(`Position (${this.position.x}, ${this.position.y})`
          + ` of ${this.getEntity().debugId} is not synchronized with`
          + ` position of it's physics body (${this.physicsBody.getX()},`
          + ` ${this.physicsBody.getY()})`);
      }
    }

    return this.position.x;
  }
  // ! Throws exception on error.
  public getY()
  {
    if (this.physicsBody !== "Not in physics world")
    {
      // ! Throws exception on error.
      if (this.physicsBody.getY() !== this.position.y)
      {
        throw Error(`Position (${this.position.x}, ${this.position.y})`
          + ` of ${this.getEntity().debugId} is not synchronized with`
          + ` position of it's physics body (${this.physicsBody.getX()},`
          + ` ${this.physicsBody.getY()})`);
      }
    }

    return this.position.y;
  }

  // ! Throws exception on error.
  public getPosition()
  {
    // ! Throws exception on error.
    return new Vector({ x: this.getX(), y: this.getY() });
  }

  // ! Throws exception on error.
  public setPosition(position: { x: number; y: number })
  {
    this.position.x = position.x;
    this.position.y = position.y;

    // ! Throws exception on error.
    this.getPhysicsBody().setPosition(position);
  }

  // ! Throws exception on error.
  public getRotation()
  {
    if (this.physicsBody !== "Not in physics world")
    {
      const physicsRotation = this.getPhysicsBody().getRotation();

      if (physicsRotation.valueOf() !== this.rotation.valueOf())
      {
        throw Error(`Rotation ${this.rotation.valueOf()} of`
          + ` ${this.getEntity().debugId} is not`
          + ` synchronized with rotation of it's physics`
          + ` body ${physicsRotation.valueOf()}`);
      }

      return physicsRotation;
    }

    return this.rotation;
  }

  // ! Throws exception on error.
  public setRotation(rotation: ZeroTo2Pi)
  {
    this.rotation.set(rotation.valueOf());

    // ! Throws exception on error.
    this.getPhysicsBody().setRotation(rotation);
  }

  // ! Throws exception on error.
  public getShape()
  {
    // ! Throws exception on error.
    return this.getPhysicsBody().getShape();
  }

  // ! Throws exception on error.
  public setEntity(entity: PhysicsEntity)
  {
    if (this.hasOwnProperty("entity") && this.entity !== "Not set")
    {
      throw Error(`Failed to set reference to ${entity.debugId}`
        + ` to it's physics because there already is a reference`
        + ` to entity ${this.entity.debugId} there`);
    }

    this.entity = entity;
  }

  // ! Throws exception on error.
  public getEntity()
  {
    if (this.entity === "Not set")
    {
      throw Error(`Missing reference to physics entity in it's`
        + ` physics. Make sure the reference is set in vehicle's`
        + ` onInstantiation() method`);
    }

    return this.entity;
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public addToPhysicsWorld(physicsWorld: PhysicsWorld)
  {
    // ! Throws exception on error.
    const physicsShape = this.getShapeAsset().getShape();

    this.physicsBody = physicsWorld.createPhysicsBody
    (
      this.getEntity(), this, physicsShape
    );

    /// Nothing needs to be initialized for now. I'll leave it here
    /// for possible future use.
    // // ! Throws exception on error.
    // this.init();
  }

  // ! Throws exception on error.
  // This is used on the server where position and rotation is
  // calculated by the physics engine so our stored internal
  // values (which are saved and loaded) need to be updated
  // from the physics body.
  public updateStoredPositionAndRotation()
  {
    // ! Throws exception on error.
    this.updateStoredPosition();
    // ! Throws exception on error.
    this.updateStoredRotation();
  }

  // ! Throws exception on error.
  // This is used on the client where position and rotation
  // is received from the server and they need to be set to
  // the physics body.
  public updatePhysicsPositionAndRotation()
  {
    // ! Throws exception on error.
    this.updatePhysicsPosition();
    // ! Throws exception on error.
    this.updatePhysicsRotation();
  }

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  protected getPhysicsBody()
  {
    if (this.physicsBody === "Not in physics world")
    {
      throw Error(`Physics entity ${this.getEntity().debugId} is not`
        + ` in physics world yet and doesn't have a physics body`);
    }

    return this.physicsBody;
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private updateStoredPosition()
  {
    // ! Throws exception on error.
    const physicsBody = this.getPhysicsBody();

    // ! Throws exception on error.
    this.position.x = physicsBody.getX();
    // ! Throws exception on error.
    this.position.y = physicsBody.getY();
  }

  // ! Throws exception on error.
  private updateStoredRotation()
  {
    // ! Throws exception on error.
    this.rotation.set(this.getPhysicsBody().getRotation().valueOf());
  }

  // ! Throws exception on error.
  private updatePhysicsPosition()
  {
    // ! Throws exception on error.
    this.getPhysicsBody().setPosition(this.position);
  }

  // ! Throws exception on error.
  private updatePhysicsRotation()
  {
    // ! Throws exception on error.
    this.getPhysicsBody().setRotation(this.rotation);
  }
}