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
        // public static get entities() { return this.instance.entities; }
        // public static get prototypes() { return this.instance.prototypes; }
        // ------------- Public static methods ----------------
        // Don't call this directly, use ERROR() instead.
        static reportException(error) {
            this.instance.reportException(error);
        }
        // Don't call this directly, use ERROR() instead.
        static reportError(message) {
            this.instance.reportError(message);
        }
        // Don't call this directly, use ERROR() instead.
        static reportFatalError(message) {
            this.instance.reportFatalError(message);
        }
        // Sends message to syslog.
        // (Don't call this directly, use Syslog.log() instead.)
        static log(text, msgType) {
            this.instance.log(text, msgType);
        }
    }
    exports.Application = Application;
});
//# sourceMappingURL=Application.js.map