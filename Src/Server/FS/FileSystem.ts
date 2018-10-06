/*
  Part of Kosmud

  Filesystem I/O operations.
*/

import { Types } from '../../Shared/Utils/Types';
import { SavingQueue } from '../../Server/FS/SavingQueue';

// Built-in node.js modules.
import * as FS from 'fs-extra';

// 3rd party modules.
/// Module is removed for now but function isEmpty() used
/// to use it so it might be needed again.
// let extfs = require('extfs');

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

  // ! Throws exception on error.
  public static async writeFile
  (
    directory: string,
    fileName: string,
    data: string
  )
  {
    let path = directory + fileName;

    if (!FileSystem.isValidFileName(fileName))
    {
      throw new Error('Failed to write file because path "' + path + '"'
        + " does not have a valid file name");
    }

    // Following code is addresing feature of node.js file saving
    // functions which says that we must not attempt saving the same
    // file until any previous saving finishes (otherwise it is not
    // guaranteed that file will be saved correctly).
    //   To ensure this, we register all saving to each file and queue
    // saving requests if necessary.
    let result = this.requestSaving(path);

    if (result !== "Saving is possible right now")
    {
      await saveAwaiter(result);
    }

    // Now it's our turn so we can save ourselves.
    try
    {
      await writeFile(path, data);
    }
    catch (error)
    {
      // We must finish saving even if error occured
      // to not to block the saving queue.
      this.finishSaving(path);
      throw error;
    }

    // Remove the lock and resolve saveAwaiter()
    // of whoever is waiting after us.
    this.finishSaving(path);
  }

  // ! Throws exception on error.
  public static async deleteFile(path: string)
  {
    // ! Throws exception on error.
    checkPathValidity(path);

    try
    {
      await FS.unlink(path);
    }
    catch (error)
    {
      throw new Error("Failed to delete file '" + path + "': " + error.code);
    }
  }

  // ! Throws exception on error.
  public static async exists(path: string): Promise<boolean>
  {
    // ! Throws exception on error.
    checkPathValidity(path);

    return await FS.pathExists(path);
  }

  // ! Throws exception on error.
  public static async ensureDirectoryExists(directory: string)
  {
    // ! Throws exception on error.
    checkPathValidity(directory);

    try
    {
      await FS.ensureDir(directory);
    }
    catch (error)
    {
      throw new Error('Unable to ensure existence of'
        + ' directory "' + directory + '": ' + error.code);
    }
  }

  /// This function used 'extfs' module which I removed as (almost)
  /// unnecessary. If this function is needed, it needs to be implemented
  /// differently or 'extfs' needs to be added again.
  // // ! Throws exception on error.
  // //  Directory is empty if it doesn't exist or there are no files in it.
  // //  File is empty if it doesn't exist or it has zero size.
  // public static async isEmpty(path: string): Promise<boolean>
  // {
  //   // ! Throws exception on error.
  //   checkPathValidity(path);

  //   return await FS.isEmpty(path);
  // }

  // ! Throws exception on error.
  // -> Returns array of file names in directory, including
  //    subdirectories, excluding '.' and '..'.
  public static async readDirectoryContents
  (
    path: string
  )
  : Promise<Array<string>>
  {
    // ! Throws exception on error.
    checkPathValidity(path);

    try
    {
      return await FS.readdir(path);
    }
    catch (error)
    {
      throw new Error('Unable to read contents of directory'
        + ' "' + path + '": ' + error.code);
    }
  }

  // ! Throws exception on error.
  // -> Returns 'false' if 'path' is not a directory or an error occured.
  public static async isDirectory(path: string): Promise<boolean>
  {
    // ! Throws exception on error.
    checkPathValidity(path);

    // ! Throws exception on error.
    return (await statFile(path)).isDirectory();
  }

  // -> Returns 'false' if 'path' is not a file or an error occured.
  public static async isFile(path: string): Promise<boolean>
  {
    // ! Throws exception on error.
    checkPathValidity(path);

    // ! Throws exception on error.
    return (await statFile(path)).isFile();
  }

  // ---------------- Private methods ------------------- 

  // If promise is returned, whoever is requesting saving
  // must wait using saveAwaiter(promise).
  private static requestSaving
  (
    path: string
  )
  : Promise<{}> | "Saving is possible right now"
  {
    let queue = this.savingQueues.get(path);

    if (!queue)
    {
      // Nobody is saving to the path yet.
      queue = new SavingQueue();

      // Note: We don't push a resolve callback for the first
      // request, because it will be processed right away.
      this.savingQueues.set(path, queue);

      return "Saving is possible right now";
    }
    
    // Someone is already saving to the path.
    return queue.addRequest();
  }

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

// ! Throws exception on error.
async function writeFile(path: string, data: string)
{
  // ! Throws exception on error.
  checkPathValidity(path);

  try
  {
    await FS.writeFile(path, data, FileSystem.UTF8);
  }
  catch (error)
  {
    throw new Error ("Failed to save file '" + path + "': " + error.code);
  }
}

// This is just a generic async function that will finish
// when 'promise' parameter gets resolved.
// (This only makes sense if you also store resolve callback
//  of the promise so you can call it to finish this awaiter.
//  See SavingQueue.addRequest() for example how is it done.)
function saveAwaiter(promise: Promise<{}>)
{
  return promise;
}

// ! Throws exception on error.
async function statFile(path: string): Promise<FS.Stats>
{
  // ! Throws exception on error.
  checkPathValidity(path);

  try
  {
    return await FS.stat(path);
  }
  catch (error)
  {
    throw new Error('Unable to stat file "' + path + '": ' + error.code);
  }
}