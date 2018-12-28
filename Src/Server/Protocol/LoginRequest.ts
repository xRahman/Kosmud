/*
  Part of Kosmud

  Incoming request to enter game.

  (Part of client-server communication protocol.)
*/

// import { Account } from "../../Server/Account/Account";
import { Accounts } from "../../Server/Account/Accounts";
// import * as Entities from "../../Server/Class/Entities";
import { Connection } from "../../Server/Net/Connection";
import * as Shared from "../../Shared/Protocol/LoginRequest";

export class LoginRequest extends Shared.LoginRequest
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    // /// TEST: Vyrobit a savnout account.
    // const account = Accounts.newAccount();
    // await account.save();

    const account = await Accounts.loadAccount();

    connection.setAccount(account);
  }
}

// This class is registered in Server/Net/Connection.