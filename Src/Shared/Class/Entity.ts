/*
  Part of Kosmud

  Entity is an Object that:
  - has a unique id
  - can be serialized and deserialized
  - can be inherited from another entity using
    true prototypal inheritance

  True prototypal inheritance means that an instance
  is created using Object.create() so it is just an
  empty {} with no own properties and that all it's
  nonprimitive properties are also instantiated using
  Obect.create() against the matching property on the
  prototype entity.
    This way all properties inicialized on prototype
  entity by it's constructor or direct inicialization
  in class body in typescript class will actually be
  set to prototype object, not the instance. Properties
  set to the instance will also never modify the prototype
  (unlinke in javascript prototypal inheritance where
  nonprimitive properties of the instance are references
  to the matching properties on the prototype so writing
  to them actually modifies the prototype object instead
  of creating own propety on the instance).
*/

// import {Utils} from '../../shared/Utils';
// import {DEFAULT_ATTRIBUTES} from '../../Shared/Class/Attributes';
// import {Attributes} from '../../Shared/Class/Attributes';
import {Serializable} from '../../Shared/Class/Serializable';

export class Entity extends Serializable
{
  /// Zatím provizorně.
  id: string = "";

  // --------------- Public methods ---------------------

  // -------------- Protected methods -------------------

  // --------------- Private methods --------------------
}
