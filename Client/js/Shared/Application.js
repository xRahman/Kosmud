/*
  Part of Kosmud

  Abstract ancestor for Client and Server.
*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {Entities} from '../../../shared/lib/entity/Entities';
    // import {Prototypes} from '../../../shared/lib/entity/Prototypes';
    class Application {
        // ---------------- Protected data --------------------
        // protected isRunning = false;
        // protected abstract entities: Entities;
        // protected abstract prototypes: Prototypes;
        // --------------- Static accessors -------------------
        // public static get entities() { return this.getInstance().entities; }
        // public static get prototypes() { return this.getInstance().prototypes; }
        static getInstance() {
            if (!this.instance) {
                throw new Error("Application.instance is not inicialized. It needs to be"
                    + " assigned in all descendant classes (Client and Server).");
            }
            return this.instance;
        }
        // ------------- Public static methods ----------------
        // Don't call this directly, use ERROR() instead.
        static reportException(error) {
            this.getInstance().reportException(error);
        }
        // Don't call this directly, use ERROR() instead.
        static reportError(message) {
            this.getInstance().reportError(message);
        }
        // Don't call this directly, use ERROR() instead.
        static reportFatalError(message) {
            this.getInstance().reportFatalError(message);
        }
        // Sends message to syslog.
        // (Don't call this directly, use Syslog.log() instead.)
        static log(text, msgType) {
            this.getInstance().log(text, msgType);
        }
    }
    // -------------- Static class data -------------------
    // This property needs to be inicialized in descendants
    // (see Client.instance or Server.instance).
    Application.instance = null;
    exports.Application = Application;
});
//# sourceMappingURL=Application.js.map