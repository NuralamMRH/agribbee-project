import { truncate } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  // const format = number ? numeral(number).format('$0,0.00') : '';
  // return result(format, '.00');

  let newNumber = truncate(number?.toString(), 0);
  if (newNumber > 10000) {
    if (newNumber >= 1000000000) {
      // Billion
      newNumber = (newNumber / 1000000000)?.toFixed(0) + 'B';
      return `${'Đ'} ${newNumber}`;
    } else if (newNumber >= 1000000) {
      // Million
      newNumber = (newNumber / 1000000)?.toFixed(0) + 'M';
      return `${'Đ'} ${newNumber}`;
    } else if (newNumber >= 1000) {
      // Thousand
      newNumber = (newNumber / 1000)?.toFixed(0) + 'k';
      return `${'Đ'} ${newNumber}`;
    }
  } else {
    return `${'Đ'} ${newNumber}`;
  }
  return newNumber;
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
