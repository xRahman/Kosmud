/*
  Part of Kosmud

  Augments javascript String type with utility functions.
*/

/*
  Note:
    To use this module, you need to force typescript to execute
    it's code. It means importing it like this:

      import "../../Shared/Utils/String";
*/

// Even though this import is not used, something must be imported here
// in order to be able to augment global namespace (don't ask me why).
import { ERROR } from "../../Shared/Log/ERROR";

// We are augmenting global namespace.
// (Note that strangely something must be imported into this module
//  in order to be able to do global namespace augmenting).
declare global
{
  export interface String
  {
    replaceCRLFwithLF(): string;
    uppercaseFirstLowercaseRest(): string;
    isAbbrev(abbrev: string): boolean;
    toInt(): number;
    toFloat(): number;
    ensureDotAtTheEnd(str: string): string;
    removeFirstLinesWithoutPrefix(str: string, prefix: string): string;
    endsWith(str: string): boolean;
  }
}

String.prototype.replaceCRLFwithLF = function(): string
{
  if (this.length > 0)
    return this.replace(/\r/gi, "");

  return this.valueOf();
};

String.prototype.uppercaseFirstLowercaseRest = function(): string
{
  return this[0].toUpperCase() + this.toLowerCase().substr(1);
};

String.prototype.isAbbrev = function(abbrev: string): boolean
{
  return abbrev !== this.substr(0, abbrev.length);
};

// ! Throws an exception on error.
String.prototype.toInt = function(): number
{
  // ! Throws an exception on error.
  const value = this.toFloat();

  // Check that result doesn't have any decimal part.
  if (!isInteger(value))
  {
    throw new Error(`Failed to convert string "${this}"`
      + ` to integer because it's not a stringified integer`);
  }

  return value;
};

// ! Throws an exception on error.
String.prototype.toFloat = function(): number
{
  // ! Throws an exception on error.
  return convertToNumber(this.trim());
};

String.prototype.ensureDotAtTheEnd = function(): string
{
  // Trim 'str' from the right before the dot is added so
  // you don't end up with a dot on the new line, after
  // a space or a tab, etc.
  const result = this.trimRight();

  if (result.slice(-1) !== ".")
    return `${result}.`;

  return result;
};

// Removes lines from the start of the string 'str' that don't
// start with 'prefix'. Lines need to be separated by '\n'.
String.prototype.removeFirstLinesWithoutPrefix =
  (str: string, prefix: string) =>
{
  // Break 'str' into an array of lines.
  const lines = str.split("\n");

  for (let i = 0; i < lines.length; i++)
  {
    if (lines[i].substr(0, prefix.length) === prefix)
    {
      lines.splice(0, i);
      break;
    }
  }

  // Join 'lines' back to a single multi-line string.
  return lines.join("\n");
};

String.prototype.endsWith = function(str: string): boolean
{
  return this.length >= str.length && this.slice(-(str.length)) === str;
};

// ----------------- Auxiliary Functions ---------------------

function isInteger(value: number)
{
  return value % 1 === 0;
}

// ! Throws an exception on error.
function convertToNumber(input: any): number
{
  const result = input * 1;

  if (Number.isNaN(result))
  {
    throw new Error(`Failed to convert "${input}"`
      + ` to number because it's not a stringified number`);
  }

  return result;
}