
/*
  Part of Kosmud

  Client-side packet with information about what changed in game scene.
*/

import {PhaserEngine} from '../../Client/Phaser/PhaserEngine';

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
    let sceneContents = PhaserEngine.getFlightScene().getSceneContents();

    /// Ship ještě nemusí existovat, pokud se Phaser scéna ještě neloadla.
    if (sceneContents)
      sceneContents.getShip().setPosition(this.shipPosition);
  }
}

// Classes.registerSerializableClass(SceneUpdate);