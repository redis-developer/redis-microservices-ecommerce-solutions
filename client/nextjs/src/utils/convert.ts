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
  trimmed = trimmed.substring(
    0,
    Math.min(trimmed.length, trimmed.lastIndexOf(' ')),
  );

  return trimmed + '...';
}

export function stringDateToFormattedDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export function toCurrency(amount?: string | number | null) {
  if (!amount) {
    return currency.format(0);
  }

  return currency.format(Number(amount) / 100);
}
