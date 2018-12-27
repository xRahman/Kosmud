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
    /// Je otázka, jestli to account vůbec potřebuju házet do nějakýho
    /// extra containeru - dost možná stačí mít je v Entities.
    return Entities.newEntity(Account.name).dynamicCast(Account);
  }

  export async function loadAccount()
  {
    // TODO: Determine account id.
    /// (Zatím natvrdo.)
    const accountId = "1-jq6wqw3s";

    // ! Throws exception on error.
    return loadAccountById(accountId);
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
async function loadAccountById(accountId: string)
{
  // ! Throws exception on error.
  const jsonData = await Account.loadAccountData(accountId);

  const account = Entities.loadEntityFromJsonData(accountId, jsonData);

  return account.dynamicCast(Account);
}