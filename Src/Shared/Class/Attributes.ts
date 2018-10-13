/*
  Part of Kosmud

  Static property attributes.
*/

export interface Attributes
{
  // Property is saved to disk.
  saved?: boolean,
  // Property can be edited.
  edited?: boolean,
  // Property is serialized when object is sent from the server to the client.
  sentToClient?: boolean,
  // Property is serialized when object is send from the client to the server
  sentToServer?: boolean
};

export const DEFAULT_ATTRIBUTES: Attributes =
{
  saved: true,
  edited: true,
  sentToClient: true,
  sentToServer: true
};