/*
  Part of Kosmud

  Information about keyboard input activity.

  (Part of client-server communication protocol.)
*/

import {Packet} from '../../Shared/Protocol/Packet';

export class KeyboardInput extends Packet
{
  constructor
  (
    protected action: KeyboardInput.Action,
    protected startOrStop: KeyboardInput.StartOrStop
  )
  {
    super();
  }
}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module KeyboardInput
{
  /// TODO: Tohle zatím provizorně.
  export type StartOrStop = "Start" | "Stop";
  export type Action = "Left" | "Right" | "Forward" | "Backward";
}