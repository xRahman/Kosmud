/*
  Part of Kosmud

  Various utility functions.
*/

import {ERROR} from '../Shared/Log/ERROR';
import {Types} from '../Shared/Types';

export module Utils
{
  // Most Unix filesystems have this limit on file name length.
  export const MAX_FILENAME_BYTE_LENGTH = 255;

  export function isColorCode(code: string): boolean
  {
    switch (code)
    {
      case '&n':
      case '&d':
      case '&i':
      case '&u':
      case '&l':
      case '&k':
      case '&Ki':
      case '&K':
      case '&r':
      case '&Ri':
      case '&R':
      case '&g':
      case '&Gi':
      case '&G':
      case '&y':
      case '&Y':
      case '&b':
      case '&Bi':
      case '&B':
      case '&m':
      case '&M':
      case '&c':
      case '&C':
      case '&w':
      case '&W':
        return true;        
    }

    return false;
  }

  export function encodeAsFileName(str: string)
  {
    return truncateByteLength(str, MAX_FILENAME_BYTE_LENGTH);
  }

  // ! Throws exception on error.
  export function hasValidByteLengthAsFileName(str: string)
  {
    let encodedStr = encodeStringAsFileName(str);

    return getByteLength(encodedStr) <= MAX_FILENAME_BYTE_LENGTH;
  }

  // Copies properties of 'defaults' object to 'target' object
  // if they are not present in it. This is even done recursively
  // so you can default only some sub-properties.
  // (Generic type is used to ensure that 'defaults' parameter is
  //  of the same type as 'target' parameter).
  // -> Returns modified 'target'.
  export function applyDefaults<T>(target: T, defaults: T)
  {
    if (!defaults)
      return target;

    for (let propertyName in defaults)
    {
      let sourceProperty = defaults[propertyName];
      let targetProperty = target[propertyName]

      if (!defaults.hasOwnProperty(propertyName))
        continue;

      if (sourceProperty === undefined)
        continue;

      if (targetProperty === undefined)
      {
        target[propertyName] = sourceProperty;
        continue;
      }

      // If both properties are plain objects, call applyDefaults()
      // recursively on them.
      if
      (
        Types.isPlainObject(sourceProperty)
        && Types.isPlainObject(targetProperty)
      )
      {
        applyDefaults(targetProperty, sourceProperty);
      }
    }

    return target;
  }

  // ! Throws exception on error.
  // This function is used to enforce that all switch cases are handled
  // when using compound type of switch argument.
  //
  //   Example:
  //     iport {Utils} from '../Shared/Utils';
  //
  //     type Type = "Blue" | "Red";
  //
  //     function something(type: Type)
  //     {
  //       switch (type)
  //       {
  //         case "Blue":
  //           doSomething();
  //           break;
  //
  //         default:
  //           // Typescript will show intelisense error here saying:
  //           //   "Argument of type '"Red"' is not
  //           //    assignable to parameter of type 'never'" because
  //           //  you forgot to handle "Red" case.
  //           Utils.reportMissingCase(type);
  //       }
  //     }
  export function reportMissingCase(variable: never)
  {
    throw new Error("Unhandled switch case");
  }
}

// ----------------- Private Module Stuff --------------------

/// Not used anymore. All file names are encoded now.
// // Conversion table used to encode and decode e-mail
// // address so it can be used as file name on all OSses.
// const EMAIL_ENCODED_CHARACTERS = new Map
// (
//   [
//     ['*', '(star)'],
//     ['/', '(slash)'],
//     ['?', '(questionmark)'],
//     ['|', '(verticalbar)']
//   ]
// );

const FILENAME_RESERVED_CHARACTERS = new Map
(
  [
    ['~',  '~~'],                // Escape character.
    ['<',  '~LT~'],
    ['>',  '~GT~'],
    [':',  '~CL~'],    
    ['"',  '~QT~'],
    ['/',  '~FS~'],
    ['\\', '~BS~'],
    ['|',  '~VB~'],
    ['?',  '~QM~'],
    ['*',  '~AS~']
  ]
);

const RESERVED_FILENAMES = new Map
(
  [
    // Reserved characters.
    ['.',  '~.~'],
    ['..',  '~..~'],
    ['con',  '~CON~'],
    ['prn',  '~PRN~'],
    ['aux',  '~AUX~'],
    ['nul',  '~NUL~']
  ]
);

// ! Throws exception on error.
function getByteLength(str: string)
{
  // Note: I didn't manage to find an easy and simple way
  //   to compute byte lenghth of a string both in the browser
  //   and on node.js. To work around it, we try two methods.

  // This should work in the browser.
  if (typeof Blob !== 'undefined')
  {
    // Don't ask me what Blob is, I just googled it and copy&pasted it
    // (important point is, that blob.size tell us byte length of 'data').
    return new Blob([str]).size;
  }

  // This should work on node.js.
  if (typeof Buffer !== 'undefined')
    return Buffer.byteLength(str, 'utf8');

  throw new Error("Unable to compute byte length of a string because"
    + " neither 'Blob' object nor 'Buffer' object is supported.");
}

function reportTruncation
(
  str: string,
  truncatedStr: string,
  maxByteLength: number
)
{
  ERROR("Failed to correctly encode string '" + str + "' as filename"
    + " because it's longer than " + maxByteLength + " bytes after"
    + " encoding. Truncating it to '" + truncatedStr + "'. Note that"
    + " this means that if some other string used as file name exceeds"
    + " this limit, it could refer to the same file. You should prevent"
    + " entity names (or any other source of file names) to exceed byte"
    + " length of " + maxByteLength);
}

// ! Throws exception on error.
// -> Returns string encoded to be safely used as filename
//    and truncated to 'maxByteLength' bytes of length.
function truncateByteLength(str: string, maxByteLength: number)
{
  if (maxByteLength < 1)
  {
    ERROR("Invalid 'maxByteLength' parameter. String is not truncated");
    return str;
  }

  let truncatedStr = str;
  let encodedStr = encodeStringAsFileName(str);
  let byteLength = getByteLength(encodedStr);

  while (byteLength > maxByteLength && str.length > 0)
  {
    // Note that we are shortening the original, unencoded
    // string and reencoding it before byte length check.
    // That's because if we shortened encoded string, it
    // could stop being valid file name.
    truncatedStr = truncatedStr.slice(0, -1);

    encodedStr = encodeStringAsFileName(str);
    byteLength = getByteLength(encodedStr);
  }

  if (truncatedStr.length < str.length)
    reportTruncation(str, truncatedStr, maxByteLength);
  
  return encodedStr;
}

function replaceControlCharacter(str: string, charCode: number)
{
  // Create string from integer charcode value.
  let key = String.fromCharCode(charCode);

  // Coerce 'charCode' to string, so 0x00 becomes '0', etc.
  let value = '~' + charCode + '~';

  return str.split(key).join(value);
}

function escapeReservedCharacters(str: string)
{
  for (let [key, value] of FILENAME_RESERVED_CHARACTERS.entries())
    str = str.split(key).join(value);

  return str;
}

function escapeReservedFilenames(str: string)
{
  for (let [key, value] of RESERVED_FILENAMES.entries())
  {
    if (str === key)
    {
      str = value;
      return str;
    }
  }

  for (let i = 1; i <= 9; i++)
  {
    // Escape COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9.
    if (str === 'com' + i)
    {
      str = '~com' + i + '~';
      return str;
    }

    // Escape LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, LPT9.
    if (str === 'lpt' + i)
    {
      str = '~lpt' + i + '~';
      return str;
    }
  }

  return str;
}

function escapeControlCharacters(str: string)
{
  // Escape control characters (0x00–0x1F)
  for (let i = 0x00; i < 0x1F; i++)
    str = replaceControlCharacter(str, i);

  // Escape control characters (0x80–0x9f)
  for (let i = 0x80; i < 0x9f; i++)
    str = replaceControlCharacter(str, i);

  return str;
}

function escapeTrailingCharacter(str: string, character: string)
{
  if (str.slice(-1) === character)
    str = str.slice(0, -1) + '~' + character + '~';

  return str;
}

function encodeStringAsFileName(str: string)
{
  str = str.toLowerCase();
  str = escapeReservedCharacters(str);
  str = escapeReservedFilenames(str);
  str = escapeControlCharacters(str);
  str = escapeTrailingCharacter(str, '.');
  str = escapeTrailingCharacter(str, ' ');

  return str;
}