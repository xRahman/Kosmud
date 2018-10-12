
/*
  Part of Kosmud

  Description of change of scene contents.
*/


import {Renderer} from '../../Client/Phaser/Renderer';
import {Classes} from '../../Shared/Class/Classes';
import {Connection} from '../../Client/Net/Connection';
import {GameEntity} from '../../Shared/Game/GameEntity';
import * as Shared from '../../Shared/Protocol/SceneUpdate';

export class SceneUpdate extends Shared.SceneUpdate
{
  constructor(shipPosition: GameEntity.Position)
  {
    super(shipPosition);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    let sceneContents = Renderer.getFlightSceneContents();

    if (sceneContents)
      sceneContents.getShip().setPosition(this.shipPosition);
  }
}

// This class is registered in Connection.