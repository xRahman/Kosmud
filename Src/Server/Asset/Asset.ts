/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Assets } from "../../Server/Asset/Assets";
import * as Shared from "../../Shared/Asset/Asset";

export abstract class Asset extends Shared.Asset
{
  public abstract async load(): Promise<void>;

  public abstract init(): void;

  public async save()
  {
    // ! Throws exception on error.
    const fileName = Entities.getFileName(this.getId());

    // ! Throws exception on error.
    const data = this.serialize("Save to file");

    /// TODO: Loadovat definice assetů z podadresářů podle class name
    ///   by znamenalo savovat className do referencí, takže prozatím
    ///   hodím všechno do Data/Assets.
    /// const directory = `./Data/Assets/${asset.getClassName()}/`;

    // ! Throws exception on error.
    await FileSystem.writeFile(Assets.dataDirectory, fileName, data);
  }
}
