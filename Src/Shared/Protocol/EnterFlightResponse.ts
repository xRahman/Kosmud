/*  Part of Kosmud  */

import { Packet } from "../../Shared/Protocol/Packet";

export class EnterFlightResponse extends Packet
{
  constructor
  (
    /// TODO: Tady by měla být data zóny
    ///       - co se má preloadnout
    ///       - to, co player zrovna vidí
    /// TODO: Naopak by se neměl posílat shape
    /// (ten se na klientu vytáhne z dat)
    // public shipShape: Physics.Shape = [],
    // public shipPosition: Vector = new Vector(),
    // public shipRotation: number = 0
  )
  {
    super();
  }
}
