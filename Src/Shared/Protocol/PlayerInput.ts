/*
  Part of Kosmud

  Information about player input activity (kepresses, mouse clicks etc.).

  (Part of client-server communication protocol.)
*/

import {Packet} from '../../Shared/Protocol/Packet';

export class PlayerInput extends Packet
{
  constructor
  (
    protected input: PlayerInput.Action | PlayerInput.MouseMove
  )
  {
    super();

    this.version = 0;
  }
}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module PlayerInput
{
  export type MouseMove =
  {
    inputType: "Mouse move"
    x: number,
    y: number
  };

  export type StartOrStop = "Start" | "Stop";
  export type ActionType = "Left" | "Right" | "Forward"| "Backward";

  /// TODO: Tohle zatím provizorně.
  export type Action =
  {
    inputType: "Action",
    actionType: ActionType,
    startOrStop: StartOrStop;
  };
}