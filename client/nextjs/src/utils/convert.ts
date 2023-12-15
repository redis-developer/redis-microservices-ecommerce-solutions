import DOMPurify from 'dompurify';

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

export function createMarkup(htmlContent: string) {
  return {
    __html: DOMPurify.sanitize(htmlContent)
  };
};

export function setObjectToWindowQueryParams(obj: any) {
  // const params = new URLSearchParams(window.location.search); //to persist existing query params
  const params = new URLSearchParams();

  Object.keys(obj).forEach((key) => {
    params.set(key, obj[key]);
  });

  let url = window.location.pathname;
  const paramsStr = params.toString();
  if (paramsStr) {
    url += '?' + paramsStr;
  }

  window.history.replaceState(
    {},
    '',
    url,
  );
}

export function getObjectFromWindowQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const obj: any = {};

  params.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

export function convertObjectToLabel(obj: any) {
  let label = "";
  if (obj && Object.keys(obj).length) {
    label = Object.keys(obj)
      .map((key) => `${key}:${obj[key]}`)
      .join(', ');
  }
  return label;
}

export function formatChatBotAnswer(answer: string) {
  if (answer) {
    answer = answer.replace(/\n/g, '<br/>');
    answer = answer.replace(/<a/g, '<a class="text-blue-500 underline"');
  }
  return answer;
}