// export function getShortName(str: string, len = 80) {
//   const regex = new RegExp('^(.{' + len + '}[^\\s]*).*', 'mi');
//   const noHtml = str.replace(/(<([^>]+)>)/gi, ' ').trim();

//   return noHtml.replace(regex, '$1').trim() + ' ...';
// }

export function getShortName(str: string, len = 80) {
  // Remove all HTML tags
  const noHtml = str.replace(/(<([^>]+)>)/gi, '').trim();

  // If the string is already shorter than or equal to the limit, just return it
  if (noHtml.length <= len) {
    return noHtml;
  }

  // Trim to the desired length without cutting words
  let trimmed = noHtml.substring(0, len);
  trimmed = trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));

  return trimmed + '...';
}



export function stringDateToFormattedDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}
