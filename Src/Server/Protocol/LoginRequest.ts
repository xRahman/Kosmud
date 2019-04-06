/*  Part of Kosmud  */

import { Ships } from "../../Server/Game/Ships";
import { Assets } from "../../Server/Asset/Assets";
import { Zones } from "../../Server/Game/Zones";
import { Player } from "../../Server/Game/Player";
import { Players } from "../../Server/Game/Players";
// import * as Entities from "../../Server/Class/Entities";
import { Connection } from "../../Server/Net/Connection";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { LoginResponse } from "../../Shared/Protocol/LoginResponse";
import * as Shared from "../../Shared/Protocol/LoginRequest";

export class LoginRequest extends Shared.LoginRequest
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    /// TEST: Vyrobit a savnout playera.
    const player = await testCreatePlayerShipAndZone();

    // const player = await Players.loadPlayer();

    connection.setPlayer(player);

    acceptRequest(connection, player);
  }
}

// ----------------- Auxiliary Functions ---------------------

function acceptRequest(connection: Connection, player: Player)
{
  const response = createOkResponse(player);

  connection.send(response);
}

// ! Throws exception on error.
function createOkResponse(player: Player)
{
  // ! Throws exception on error.
  const response = ClassFactory.newInstance(LoginResponse);

  if (player.isInZone())
  {
    // ! Throws exception on error.
    const zone = player.getZone();
    const assets = zone.compileListOfAssets();

    /// Zase zkusím prohodit pořadí kvůli prolinkování při deserializaci...
    response.setAssets(assets);
    response.setZone(zone);
  }

  /// Zkusím tohle hodit až za setnutí zóny do packetu,
  /// aby se při deserializaci nejdřív vytvořila zóna
  /// a player.activeShip se rovnou nastavila jako valid entita.
  /// (Pomohlo to. Úplně se mi ale nelíbí, že musím takhle pitomě
  ///  řešit pořadí. Budu muset vymyslet, co s tím).
  // ! Throws exception on error.
  response.setPlayer(player);

  return response;
}

async function testCreatePlayerShipAndZone()
{
  const zone = Zones.newZone("Test zone");
  const ship = Ships.newShip("Fighter");

  const textureAsset = Assets.newTextureAsset("Basic ships Texture");
  textureAsset.descriptor.path = "Textures/Ships/basic_ships.png";
  ship.setTextureAsset(textureAsset);
  await textureAsset.save();

  const textureAtlasAsset = Assets.newTextureAtlasAsset
  (
    "Exhaust yellow rectangular Texture atlas"
  );
  textureAtlasAsset.descriptor.path =
    "Textures/Effects/Exhausts/ExhaustYellowRectangular.json";
  textureAtlasAsset.descriptor.textureDirectory =
    "Textures/Effects/Exhausts";
  ship.setTextureAtlasAsset(textureAtlasAsset);
  await textureAtlasAsset.save();

  const tilemapAsset = Assets.newTilemapAsset("Basic ships");
  tilemapAsset.descriptor.path = "Tilemaps/Ships/basic_ships.json";
  ship.setTilemapAsset(tilemapAsset);
  await tilemapAsset.save();

  const shapeAsset = Assets.newShapeAsset("Fighter hull");
  shapeAsset.setTilemapAsset(tilemapAsset);
  shapeAsset.descriptor.objectName = "Hull";
  shapeAsset.descriptor.objectLayerName = "Basic fighter";
  ship.setShapeAsset(shapeAsset);
  await shapeAsset.save();

  const exhaustSoundAsset = Assets.newSoundAsset("Exhaust sound 00");
  exhaustSoundAsset.descriptor.path = "Sound/Ship/Engine/ShipEngine.mp3";
  ship.setExhaustSoundAsset(exhaustSoundAsset);
  await exhaustSoundAsset.save();

  await Assets.save();

  /// IMPORTANT:
  /// Před tím, než se ship přidá do zóny, je na nově vytvořených
  /// assetech potřeba loadnout data tilemapy a inicializovat shape.
  await tilemapAsset.load();
  shapeAsset.init();

  zone.addVehicle(ship);

  await zone.save();
  await Zones.save();

  const player = Players.newPlayer();
  player.setActiveShip(ship);
  await player.save();

  return player;
}

// This class is registered in Server/Net/Connection.