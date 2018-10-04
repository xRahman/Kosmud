/*
  Part of Kosmud

  Abstract ancestor for Client and Server.
*/

/*
  Application is a singleton. We could implement it by
  using only static methods and data so we wouln't need
  to ensure that there is only one instance. We can't
  do that, though, because we need polymorphism in order
  to call server or client version of some methods from
  shared code (by calling Application.method()). So we
  do need a singleton instance after all.

  The good news is that we don't need stuff like
  'createInstance()' - all we need is an initialized
  static property 'instance'. It can only exist once
  because it is static and it is only assigned once
  because static properties are only inicialized once.
  This way we also don't need to ensure that an instance
  exists every time we want to use it, because when you
  import and Application module, initializer is executed
  automatically.
*/

import {Entities} from '../Shared/Class/Entities';

export abstract class Application
{
  // -------------- Static class data -------------------

  // This property needs to be inicialized in descendants
  // (see Client.instance or Server.instance).
  protected static instance: Application | null = null;

  // ---------------- Protected data --------------------

  // protected isRunning = false;

  // Note:
  //   We need to have .entities in Application instead in Entities
  //   because importing Entities to Serializable would cause cyclical
  //   module dependancy (Entities import Entity which imports Serializable).
  //   Doing it using Application.entities for some reason works.
  protected abstract entities: Entities;
  // protected abstract prototypes: Prototypes;

  // --------------- Static accessors -------------------

  public static get entities() { return this.getInstance().entities; }
  // public static get prototypes() { return this.getInstance().prototypes; }

  private static getInstance(): Application
  {
    if (!this.instance)
    {
      throw new Error
      (
        "Application.instance is not inicialized. It needs to be"
        + " assigned in all descendant classes (Client and Server)."
      );
    }

    return this.instance;
  }

  // ------------- Public static methods ----------------

  // --------------- Protected methods ------------------

}
