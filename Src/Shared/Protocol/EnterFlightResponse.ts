/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Physics } from "../../Shared/Physics/Physics";
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
    public shipShape: Physics.Shape,
    public shipPosition: Vector,
    public shipRotation: number
  )
  {
    super();
  }
}