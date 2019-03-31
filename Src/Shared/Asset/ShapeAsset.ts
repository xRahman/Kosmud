/*  Part of Kosmud  */

import { Physics } from "../../Shared/Physics/Physics";
import { ShapeDescriptor } from "../../Shared/Asset/ShapeDescriptor";
import { Asset } from "../../Shared/Asset/Asset";

export interface ShapeAsset extends Asset
{
  readonly descriptor: ShapeDescriptor;

  getShape(): Physics.Shape;
}