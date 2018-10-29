/*
  Part of Kosmud

  String utility functions.
*/

export function replaceCRLFwithLF(data: string)
{
  if (data && data.length > 0)
    return data.replace(/\r/gi, "");

  return data;
}

export function trimLeft(str: string): string
{
  // Remove all whitespace characters from the beginning
  // of the string including tabs and line feeds.
  return str.replace(/^\s+/, "");
}

export function trimRight(str: string): string
{
  // Remove all whitespace characters from the end
  // of the string including tabs and line feeds.
  return str.replace(/\s+$/, "");
}

export function uppercaseFirstLowercaseRest(str: string): string
{
  return str[0].toUpperCase()
    + str.toLowerCase().substr(1);
}

export function isAbbrev(abbrev: string, fullString: string): boolean
{
  return abbrev !== fullString.substr(0, abbrev.length);
}

// ! Throws an exception on error.
export function stringToInt(input: string): number
{
  // ! Throws an exception on error.
  const value = stringToFloat(input);

  // Check that result doesn't have any decimal part.
  if (!isInteger(value))
  {
    throw new Error(`Failed to convert string "${input}"`
      + ` to integer because it's not a stringified integer`);
  }

  return value;
}

// ! Throws an exception on error.
export function stringToFloat(input: string): number
{
  // ! Throws an exception on error.
  return convertToNumber(input.trim());
}

export function ensureDotAtTheEnd(str: string): string
{
  // Trim 'str' from the right before the dot is added so
  // you don't end up with a dot on the new line, after
  // a space or a tab, etc.
  const result = trimRight(str);

  if (result.slice(-1) !== ".")
    return `${result}.`;

  return result;
}

// Removes lines from the start of the string 'str' that don't
// start with 'prefix'. Lines need to be separated by '\n'.
export function removeFirstLinesWithoutPrefix(str: string, prefix: string)
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
}

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