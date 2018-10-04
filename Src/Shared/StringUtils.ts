/*
  Part of Kosmud

  String utility functions.
*/

export module StringUtils
{
  // Make sure that all newlines are representedy by '\n'.
  export function normalizeCRLF(data: string)
  {
    if (data && data.length > 0)
    {
      // Remove all '\r' characters
      // (so '\n' stays as it is and '\r\n'
      //  or '\n\r' are converted to '\n').
      data = data.replace(/\r/gi, "");
    }

    return data;
  }

  // Removes all whitespace characters from the beginning of the string,
  // including tabs and line feeds.
  export function trimLeft(str: string): string
  {
    return str.replace(/^\s+/,"");
  }

  // Removes all whitespace characters from the end of the string,
  // including tabs and line feeds.
  export function trimRight(str: string): string
  {
    return str.replace(/\s+$/,"");
  }

  export function uppercaseFirstLowercaseRest(str: string): string
  {
    return str[0].toUpperCase()
      + str.toLowerCase().substr(1);
  }

  export function isAbbrev(abbrev: string, fullString: string): boolean
  {
    return fullString.indexOf(abbrev) !== -1;
  }

  // Converts string to integer number.
  // -> Returns null if string is not an integer number.
  export function atoi(input: string): number | null
  {
    // First convert input to float
    // (meaning that result can contain decimals).
    let result = atof(input);

    if (result === null)
      return null;

    // Check that result doesn't have any decimal part. 
    if (result % 1 !== 0)
      return null;

    return result;
  }

  // Converts string to float (number that can contain decimal point).
  // -> Returns null if 'input' is not a number.
  export function atof(input: string): number | null
  {
    // 'trim()' cuts off leating and trailing white spaces and newlines.
    // Typecast to 'any' is necessary to appease typescript.
    // '* 1' converts string to float number, or NaN if input isn't a number.
    let result = (input.trim() as any) * 1;

    if (result === NaN)
      return null;

    return result;
  }

  // Note: 'str' is trimmed from the right before the dot
  // is added so you don't end up with a dot on the new line,
  // after a space or a tab, etc.
  // -> Returns a new string which ends with a dot.
  export function ensureDotAtTheEnd(str: string): string
  {
    str = trimRight(str);

    if (str.slice(-1) !== '.')
      return str + '.';

    return str;
  }

  // Removes lines from the start of the string 'str' that don't
  // start with 'prefix'. Lines need to be separated by '\n'.
  export function removeFirstLinesWithoutPrefix(str: string, prefix: string)
  {
    // Break 'str' into an array of lines.
    let lines = str.split('\n');

    for (let i = 0; i < lines.length; i++)
    {
      if (lines[i].substr(0, prefix.length) === prefix)
      {
        lines.splice(0, i);
        break;
      }
    }

    // Join 'lines' back to a single multi-line string.
    return lines.join('\n');
  }

  /// Not used at the moment.
  // // Removes 'linesToTrim' lines from the string 'str'.
  // // Negative value of 'linesToStrim' means trim from the end of the string.
  // // Lines need to be separated by '\n'.
  // export function trimLines(str: string, linesToTrim: number)
  // {
  //   // Break 'str' into an array of lines.
  //   let lines = str.split('\n');
    
  //   if (linesToTrim >= 0)
  //   {
  //     // Remove number of lines equal to 'linesToTrim' from the strt of 'str'.
  //     lines.splice(0, linesToTrim);
  //   }
  //   else
  //   {
  //     // Remove number of lines equal to 'linesToTrim' from the end of 'str'.
  //     lines.splice(linesToTrim, -linesToTrim);
  //   }

  //   // Join 'lines' back to a single multi-line string.
  //   return lines.join('\n');
  // }
}