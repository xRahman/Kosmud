/*
  Part of Kosmud

  GameEntity class ancestor.
*/

// export class GameEntity
// {
// }

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module GameEntity
{
  export type Position =
  {
    x: number,
    y: number,
    angle: number
  };
}