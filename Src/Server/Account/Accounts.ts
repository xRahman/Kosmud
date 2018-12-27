/*
  Part of Kosmud

  Player accounts.
*/

import * as Entities from "../../Server/Class/Entities";
import { Account } from "../../Server/Account/Account";

export namespace Accounts
{
  /// TEST.
  export const account = new Account();

  export function newAccount()
  {
    /// Je otázka, jestli to account vůbec potřebuju házet do nějakýho
    /// extra containeru - dost možná stačí mít je v Entities.
    return Entities.newEntity(Account.name).dynamicCast(Account);
  }

  export function loadAccount()
  {
    /// TODO.
  }
}
