export function getShortName(str: string, len = 80) {
  const regex = new RegExp('^(.{' + len + '}[^\\s]*).*', 'mi');
  const noHtml = str.replace(/(<([^>]+)>)/gi, ' ').trim();

  return noHtml.replace(regex, '$1').trim() + ' ...';
}
