/*
  Part of Kosmud

  Player accounts.
*/

import { Entities } from "../../Server/Class/Entities";
import { Account } from "../../Server/Account/Account";

export namespace Accounts
{
  export function newAccount()
  {
    return Entities.newRootEntity(Account);
  }

  export async function loadAccount()
  {
    // TODO: Determine account id.
    /// (Zatím natvrdo.)
    const accountId = "1-jq6wqw3s";

    // ! Throws exception on error.
    const entity = await Entities.loadEntity(Account.dataDirectory, accountId);

    // ! Throws exception on error.
    return entity.dynamicCast(Account);
  }
}