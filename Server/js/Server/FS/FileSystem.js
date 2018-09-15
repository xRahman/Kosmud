"use strict";
/*
  Part of BrutusNEXT

  Wraps filesystem I/O operations.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ERROR_1 = require("../../Shared/Error/ERROR");
const Syslog_1 = require("../../Shared/Syslog");
const MessageType_1 = require("../../Shared/MessageType");
const SavingQueue_1 = require("../../Server/FS/SavingQueue");
// Built-in node.js modules.
const fs = require("fs");
// 3rd party modules.
let promisifiedFS = require('fs-promise');
let extfs = require('extfs');
class FileSystem {
    static get TEXT_FILE_ENCODING() { return 'utf8'; }
    static get BINARY_FILE_ENCODING() { return 'binary'; }
    static get JSON_EXTENSION() { return '.json'; }
    // ---------------- Public methods --------------------
    // -> Returns true if 'str' is a valid filename
    //    on both Windows and Linux.
    static isValidFileName(str) {
        if (!str || str.length > 255)
            return false;
        // Disallow characters < > : " / \ | ? *
        if ((/[<>:"\/\\|?*\x00-\x1F]/g).test(str))
            return false;
        // Disallow names reserved on Windows.
        if ((/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i).test(str))
            return false;
        // Disallow '.' and '..'.
        if (/^\.\.?$/.test(str))
            return false;
        return true;
    }
    // -> Returns data read from file, 'null' if file could not be read.
    static readFile(path, param = {
        binary: false,
        reportErrors: true
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return null;
            let data = null;
            let encoding = param.binary ?
                FileSystem.BINARY_FILE_ENCODING : FileSystem.TEXT_FILE_ENCODING;
            try {
                data = yield promisifiedFS.readFile(path, encoding);
            }
            catch (error) {
                if (param.reportErrors) {
                    let reason = error.code;
                    // Let's be more specific - we are trying to load file so ENOENT
                    // means that file doesn't exist.
                    if (error.code === 'ENOENT')
                        reason = "File doesn't exist";
                    Syslog_1.Syslog.log("Unable to load file '" + path + "': " + reason, MessageType_1.MessageType.SYSTEM_ERROR);
                }
                return null;
            }
            return data;
        });
    }
    // -> Returns data read from file, 'null' if file could not be read.
    static readFileSync(path) {
        if (!FileSystem.isPathRelative(path))
            return null;
        let data = null;
        try {
            data = fs.readFileSync(path, FileSystem.TEXT_FILE_ENCODING);
        }
        catch (error) {
            Syslog_1.Syslog.log("Unable to load file '" + path + "': " + error.code, MessageType_1.MessageType.SYSTEM_ERROR);
            return null;
        }
        return data;
    }
    // -> Returns 'true' if file was succesfully written.
    static writeFile(directory, fileName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = directory + fileName;
            if (!FileSystem.isValidFileName(fileName)) {
                ERROR_1.ERROR("Attempt to write file " + path + " which is"
                    + " not a valid file name. File is not written");
                return false;
            }
            // Following code is addresing feature of node.js file saving
            // functions, which says that we must not attempt saving the same
            // file until any previous saving finishes (otherwise it is not
            // guaranteed that file will be saved correctly).
            //   To ensure this, we use register all saving that is being done
            // to each file and buffer saving requests if necessary.
            let promise = this.requestSaving(path);
            // If requestSaving() returned 'null', it means that file 'path'
            // is not being saved right now so we can start saving right away.
            // Otherwise we have to wait untill previous saving finishes.
            if (promise !== null)
                yield this.saveAwaiter(promise);
            // Now it's our turn so we can save ourselves.
            let success = yield FileSystem.write(path, data);
            // Remove the lock and resolve saveAwaiter()
            // of whoever is waiting after us.
            this.finishSaving(path);
            return success;
        });
    }
    // -> Returns 'true' if file was succesfully deleted.
    static deleteFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return false;
            try {
                yield promisifiedFS.unlink(path);
            }
            catch (error) {
                Syslog_1.Syslog.log("Unable to delete file '" + path + "': " + error.code, MessageType_1.MessageType.SYSTEM_ERROR);
                return false;
            }
            return true;
        });
    }
    // -> Returns 'true' if file exists.
    static exists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return false;
            return yield promisifiedFS.exists(path);
        });
    }
    // -> Returns 'true' if file exists.
    static existsSync(path) {
        if (!FileSystem.isPathRelative(path))
            return false;
        return fs.existsSync(path);
    }
    // -> Returns 'true' if directory was succesfully created or if it already
    //    existed.
    static ensureDirectoryExists(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(directory))
                return false;
            try {
                yield promisifiedFS.ensureDir(directory);
            }
            catch (error) {
                Syslog_1.Syslog.log("Unable to ensure existence of directory '" + directory + "':"
                    + " " + error.code, MessageType_1.MessageType.SYSTEM_ERROR);
                return false;
            }
            return true;
        });
    }
    // -> Returns 'true' if file or directory is empty.
    //    Directory is empty if it doesn't exist or there are no files in it.
    //    File is empty if it doesn't exist or it has zero size.
    static isEmpty(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return false;
            return yield promisifiedFS.isEmpty(path);
        });
    }
    // -> Returns 'true' if file or directory is empty.
    //    Directory is empty if it doesn't exist or there no files in it.
    //    File is empty if it doesn't exist or it has zero size.
    static isEmptySync(path) {
        if (!FileSystem.isPathRelative(path))
            return false;
        return extfs.isEmptySync(path);
    }
    // -> Returns array of file names in directory, including
    //    subdirectories, excluding '.' and '..'.
    //    Returns 'null' on error.
    static readDirectoryContents(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return null;
            let fileNames = null;
            try {
                fileNames = promisifiedFS.readdir(path);
            }
            catch (error) {
                Syslog_1.Syslog.log("Unable to read directory '" + path + "':"
                    + " " + error.code, MessageType_1.MessageType.SYSTEM_ERROR);
                return null;
            }
            return fileNames;
        });
    }
    // -> Returns 'false' if 'path' is not a directory or an error occured.
    static isDirectory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return false;
            let fileStats = yield FileSystem.statFile(path);
            if (fileStats === null)
                return false;
            return fileStats.isDirectory();
        });
    }
    // -> Returns 'false' if 'path' is not a file or an error occured.
    static isFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return false;
            let fileStats = yield FileSystem.statFile(path);
            if (fileStats === null)
                return false;
            return fileStats.isFile();
        });
    }
    // ---------------- Private methods ------------------- 
    // -> Returns 'true' if 'path' begins with './'.
    static isPathRelative(path) {
        if (path.substr(0, 2) !== './') {
            ERROR_1.ERROR("File path '" + path + "' is not relative."
                + " Ensure that it starts with './'");
            return false;
        }
        return true;
    }
    // -> Returns 'fs.Stats' object describing specified file.
    //    Returns 'null' on error.
    static statFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return null;
            let fileStats = null;
            try {
                fileStats = promisifiedFS.stat(path);
            }
            catch (error) {
                Syslog_1.Syslog.log("Unable to stat file '" + path + "':"
                    + " " + error.code, MessageType_1.MessageType.SYSTEM_ERROR);
                return null;
            }
            return fileStats;
        });
    }
    // This is just a generic async function that will finish
    // when 'promise' parameter gets resolved.
    // (This only makes sense if you also store 'resolve' callback
    //  of the promise so you can call it to finish this awaiter.
    //  See SavingQueue.addRequest() for example how is it done.)
    static saveAwaiter(promise) {
        return promise;
    }
    // -> Returns 'true' if file was succesfully written.
    static write(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.isPathRelative(path))
                return false;
            try {
                yield promisifiedFS.writeFile(path, data, FileSystem.TEXT_FILE_ENCODING);
            }
            catch (error) {
                Syslog_1.Syslog.log("Unable to save file '" + path + "': " + error.code, MessageType_1.MessageType.SYSTEM_ERROR);
                return false;
            }
            return true;
        });
    }
    // -> Returns Promise if file is being saved right now so
    //      the caller needs to wait (using the returned Promise).
    // -> Returns null if this file isn't beeing saved right now
    //      so it is possible to start saving right away.
    static requestSaving(path) {
        let queue = this.savingQueues.get(path);
        if (queue === undefined) {
            // Nobody is saving to the path yet.
            queue = new SavingQueue_1.SavingQueue();
            // Note: We don't push a resolve callback for the first
            // request, because it will be processed right away.
            this.savingQueues.set(path, queue);
            return null;
        }
        // Someone is already saving to the path.
        return queue.addRequest();
    }
    static finishSaving(path) {
        let queue = this.savingQueues.get(path);
        if (queue === undefined) {
            ERROR_1.ERROR("Attempt to report finished saving of file"
                + " " + path + " which is not registered as"
                + " being saved");
            // We can't really do much if we don't have a saving record.
            return;
        }
        // Retrieve the first item from the queue.
        let resolveCallback = queue.pollRequest();
        if (!resolveCallback) {
            // If there is nothing left in the queue for this 'path',
            // we can delete it.
            this.savingQueues.delete(path);
            return;
        }
        // By calling the resolve callback we finish savingAwaiter()
        // of whoever called us. That should lead to the next saving
        // to proceed.
        resolveCallback();
    }
}
// ----------------- Private data ---------------------
// Hashmap<[ string, SavingRecord ]>
//   Key: full save path
//   Value: SavingQueue
FileSystem.savingQueues = new Map();
exports.FileSystem = FileSystem;
//# sourceMappingURL=FileSystem.js.map