/*
  Part of Kosmud

  Filesystem I/O operations.
*/

import { ERROR } from '../../Shared/Log/ERROR';
import { Syslog } from '../../Shared/Log/Syslog';
import { Types } from '../../Shared/Utils/Types';
import { MessageType } from '../../Shared/MessageType';
import { SavingQueue } from '../../Server/FS/SavingQueue';

// Built-in node.js modules.
import * as FS from 'fs-extra';

// 3rd party modules.
/// let extfs = require('extfs');

export class FileSystem
{
  public static readonly UTF8 = 'utf8';
  public static readonly BINARY = 'binary';
  public static readonly JSON = 'json';

  // ----------------- Private data ---------------------

  // Key: relative path of saved file.
  private static savingQueues = new Map<string, SavingQueue>();

  // ---------------- Public methods --------------------

  // -> Returns true if 'str' is a valid filename
  //    on both Windows and Linux.
  public static isValidFileName(str: string)
  {
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

  // ! Throws exception on error.
  public static async readFile
  (
    path: string,
    binary = false
  )
  // Return value is {} because string would conflict with other value(s).
  : Promise<{ data: string } | "File doesn't exist">
  {
    // ! Throws exception on error.
    checkPathValidity(path);

    let data: string;
    const encoding = binary ? FileSystem.BINARY : FileSystem.UTF8;

    try
    {
      data = await FS.readFile(path, encoding);
    }
    catch (error)
    {
      if (error.code === 'ENOENT')
        return "File doesn't exist";

      throw new Error("Unable to read file '" + path + "': " + error.code);
    }

    return { data };
  }

  // -> Returns data read from file, 'null' if file could not be read.
  public static readFileSync(path: string): (string | null)
  {
    if (!checkPathValidity(path))
      return null;

    let data: (string | null) = null;

    try
    {
      data = FS.readFileSync(path, FileSystem.UTF8);
    }
    catch (error)
    {
      Syslog.log
      (
        "Unable to load file '" + path + "': " + error.code,
        MessageType.SYSTEM_ERROR
      );

      return null;
    }

    return data;
  }

  // -> Returns 'true' if file was succesfully written.
  public static async writeFile
  (
    directory: string,
    fileName: string,
    data: string
  )
  : Promise<boolean>
  {
    let path = directory + fileName;

    if (!FileSystem.isValidFileName(fileName))
    {
      ERROR("Attempt to write file " + path + " which is"
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
      await this.saveAwaiter(promise);

    // Now it's our turn so we can save ourselves.
    let success = await FileSystem.write(path, data);

    // Remove the lock and resolve saveAwaiter()
    // of whoever is waiting after us.
    this.finishSaving(path);

    return success;
  }

  // -> Returns 'true' if file was succesfully deleted.
  public static async deleteFile(path: string): Promise<boolean>
  {
    if (!checkPathValidity(path))
      return false;

    try
    {
      await FS.unlink(path);
    }
    catch (error)
    {
      Syslog.log
      (
        "Unable to delete file '" + path + "': " + error.code,
        MessageType.SYSTEM_ERROR
      );

      return false;
    }

    return true;
  }

  // -> Returns 'true' if file exists.
  public static async exists(path: string): Promise<boolean>
  {
    if (!checkPathValidity(path))
      return false;

    return await FS.pathExists(path);
  }

  // -> Returns 'true' if file exists.
  public static existsSync(path: string): boolean
  {
    if (!checkPathValidity(path))
      return false;

    return FS.existsSync(path);
  }

  // -> Returns 'true' if directory was succesfully created or if it already
  //    existed.
  public static async ensureDirectoryExists(directory: string)
  : Promise<boolean>
  {
    if (!checkPathValidity(directory))
      return false;

    try
    {
      await FS.ensureDir(directory);
    }
    catch (error)
    {
      Syslog.log
      (
        "Unable to ensure existence of directory '" + directory + "':"
        + " " + error.code,
        MessageType.SYSTEM_ERROR
      );

      return false;
    }

    return true;
  }

  /// This function used 'extfs' module which I removed as (almost)
  /// unnecessary. If this function is needed, it needs to be implemented
  /// differently or 'extfs' needs to be added again.
  // // -> Returns 'true' if file or directory is empty.
  // //    Directory is empty if it doesn't exist or there are no files in it.
  // //    File is empty if it doesn't exist or it has zero size.
  // public static async isEmpty(path: string): Promise<boolean>
  // {
  //   if (!FileSystem.isPathRelative(path))
  //     return false;

  //   return await FS.isEmpty(path);
  // }

  /// This function used 'extfs' module which I removed as (almost)
  /// unnecessary. If this function is needed, it needs to be implemented
  /// differently or 'extfs' needs to be added again.
  // // -> Returns 'true' if file or directory is empty.
  // //    Directory is empty if it doesn't exist or there no files in it.
  // //    File is empty if it doesn't exist or it has zero size.
  // public static isEmptySync(path: string): boolean
  // {
  //   if (!FileSystem.isPathRelative(path))
  //     return false;

  //   return FS.isEmptySync(path);
  // }

  // -> Returns array of file names in directory, including
  //    subdirectories, excluding '.' and '..'.
  //    Returns 'null' on error.
  public static async readDirectoryContents(path: string)
  : Promise<Array<string> | null>
  {
    if (!checkPathValidity(path))
      return null;

    let fileNames: (Array<string> | null) = null;

    try
    {
      fileNames = await FS.readdir(path);
    }
    catch (error)
    {
      Syslog.log
      (
        "Unable to read directory '" + path + "':"
        + " " + error.code,
        MessageType.SYSTEM_ERROR
      );

      return null;
    }

    return fileNames;
  }

  // -> Returns 'false' if 'path' is not a directory or an error occured.
  public static async isDirectory(path: string): Promise<boolean>
  {
    if (!checkPathValidity(path))
      return false;

    let fileStats = await FileSystem.statFile(path);

    if (fileStats === null)
      return false;

    return fileStats.isDirectory();
  }

  // -> Returns 'false' if 'path' is not a file or an error occured.
  public static async isFile(path: string): Promise<boolean>
  {
    if (!checkPathValidity(path))
      return false;

    let fileStats = await FileSystem.statFile(path);

    if (fileStats === null)
      return false;

    return fileStats.isFile();
  }

  // ---------------- Private methods ------------------- 

  // -> Returns 'fs.Stats' object describing specified file.
  //    Returns 'null' on error.
  private static async statFile(path: string): Promise<FS.Stats | null>
  {
    if (!checkPathValidity(path))
      return null;

    let fileStats: (FS.Stats | null) = null;

    try
    {
      fileStats = await FS.stat(path);
    }
    catch (error)
    {
      Syslog.log
      (
        "Unable to stat file '" + path + "':"
        + " " + error.code,
        MessageType.SYSTEM_ERROR
      );

      return null;
    }

    return fileStats;
  }

  // This is just a generic async function that will finish
  // when 'promise' parameter gets resolved.
  // (This only makes sense if you also store 'resolve' callback
  //  of the promise so you can call it to finish this awaiter.
  //  See SavingQueue.addRequest() for example how is it done.)
  private static saveAwaiter(promise: Promise<{}>)
  {
    return promise;
  }

  // -> Returns 'true' if file was succesfully written.
  private static async write(path: string, data: string): Promise<boolean>
  {
    if (!checkPathValidity(path))
      return false;

    try
    {
      await FS.writeFile(path, data, FileSystem.UTF8);
    }
    catch (error)
    {
      Syslog.log
      (
        "Unable to save file '" + path + "': " + error.code,
        MessageType.SYSTEM_ERROR
      );

      return false;
    }

    return true;
  }

  // -> Returns Promise if file is being saved right now so
  //      the caller needs to wait (using the returned Promise).
  // -> Returns null if this file isn't beeing saved right now
  //      so it is possible to start saving right away.
  private static requestSaving(path: string): Promise<{}> | null
  {
    let queue = this.savingQueues.get(path);

    if (queue === undefined)
    {
      // Nobody is saving to the path yet.
      queue = new SavingQueue();

      // Note: We don't push a resolve callback for the first
      // request, because it will be processed right away.
      this.savingQueues.set(path, queue);

      return null;
    }
    
    // Someone is already saving to the path.
    return queue.addRequest();
  }

//*
  // ! Throws exception on error.
  private static finishSaving(path: string)
  {
    let queue = this.savingQueues.get(path);

    if (queue === undefined)
    {
      throw new Error("Attempt to report finished saving of file"
        + " " + path + " which is not registered as being saved");
    }

    let pollResult = queue.pollRequest();

    if (pollResult === "Queue is empty")
    {
      this.savingQueues.delete(path);
      return;
    }

    let resolveCallback: Types.ResolveFunction<{}> = pollResult;

    // By calling the resolve callback we finish savingAwaiter()
    // of whoever called us. That should lead to the next saving
    // to proceed.
    resolveCallback();
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function checkPathValidity(path: string)
{
  if (!isRelative(path))
  {
    throw new Error("File path '" + path + "' is not relative."
    + " Ensure that it starts with './'");

  }
  
  if (containsDoubleDot(path))
  {
    throw new Error("File path '" + path + "' is not valid."
    + " Ensure that it doesn't contain '..'");
  }
}

function isRelative(path: string): boolean
{
  if (path.substr(0, 2) !== './')
    return false;

  return true;
}

function containsDoubleDot(path: string): boolean
{
  return path.indexOf('..') !== -1;
}