/*  Part of Kosmud  */

import { Entity } from "../../Shared/Class/Entity";
import { AssetDescriptor } from "../../Shared/Asset/AssetDescriptor";

export abstract class Asset extends Entity
{
  protected abstract descriptor: AssetDescriptor;
}
