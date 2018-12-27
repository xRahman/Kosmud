/*
  Part of Kosmud

  Incoming request to enter game.

  (Part of client-server communication protocol.)
*/

import { Accounts } from "../../Server/Account/Accounts";
import { Connection } from "../../Server/Net/Connection";
import * as Shared from "../../Shared/Protocol/LoginRequest";

export class LoginRequest extends Shared.LoginRequest
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  // tslint:disable-next-line:prefer-function-over-method
  public async process(connection: Connection)
  {
    /// TEST: Vyrobit a savnout account.
    const account = Accounts.newAccount();
    account.save();

    // TODO: Load account.
  }
}

// ----------------- Auxiliary Functions ---------------------

// This class is registered in Server/Net/Connection.