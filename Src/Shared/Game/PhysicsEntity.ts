/*  Part of Kosmud  */

import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { EntityPhysics } from "../../Shared/Physics/EntityPhysics";
import { GameEntity } from "../../Shared/Game/GameEntity";

export class PhysicsEntity extends GameEntity
{
  public readonly physics = new EntityPhysics();

  // --------------- Public methods ---------------------

  // ! Throws exception on error.
  public addToPhysicsWorld(physicsWorld: PhysicsWorld)
  {
    this.physics.addToPhysicsWorld(physicsWorld);
  }

  // ~ Overrides Entity.onInstantiation()
  // This method is called when the entity is instantiated.
  public onInstantiation()
  {
    super.onInstantiation();

    this.physics.setEntity(this);
  }
}