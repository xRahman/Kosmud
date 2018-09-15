"use strict";
/*

                _  __                             _
               | |/ /                            | |
               | ' / ___  ___ _ __ ___  _   _  __| |
               |  < / _ \/ __| '_ ` _ \| | | |/ _` |
               | . \ (_) \__ \ | | | | | |_| | (_| |
               |_|\_\___/|___/_| |_| |_|\__,_|\__,_|


                     Client program entry point

*/
//import {ClientApp} from '../client/lib/app/ClientApp';
/// Tohle je asi zbytečný. Sice to funguje, ale udělá to jen to, že
/// chrome místo 'Uncaught (in promise) Error: [ERROR]: ...' vypíše
/// 'Uncaught Error: [ERROR]: ...'. To už je asi lepší nechat tam to
/// info, že error nastal v async funkci.
///
/// Also unlike in node.js, Chrome doesn't silently eat exceptions
/// occuring inside promises so we don't really need to re-throw
/// then on client.
///
// This handler catches exceptions thrown from withing async (promisified)
// functions.
// window.addEventListener
// (
//   'unhandledrejection',
//   (event: PromiseRejectionEvent) =>
//   {
//     if (event.reason.name === ClientApp.APP_ERROR)
//     {
//       event.preventDefault();
//       throw event.reason;
//     }
//   }
// );
//ClientApp.run(CLIENT_APP_VERSION);
alert('Yes!');
//# sourceMappingURL=KosmudClient.js.map