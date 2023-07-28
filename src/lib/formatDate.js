import { format } from 'date-fns'
import { DateTime } from 'luxon';

// JK is deprecating this in favor of BE setting date format across all dates

export const formatDate = (date) => {
  // * Date-fns didn't have a way to format timezone as 'GMT-6' instead of only 'GMT'
  let cleanDate = format(new Date(date), 'yyyy/dd/MM, hh:mm OO')
  cleanDate = cleanDate.substring(0, cleanDate.indexOf('-'))
  return cleanDate
}

export const EDTTime = (date) => {
  const dt = DateTime.fromISO(date).setZone('America/New_York')
  return dt.toFormat('MM/dd/yyyy HH:mm:ss a') + ' EDT';
}

export const TableDateFormat = (date) => {
  const dt = DateTime.fromFormat(date, 'MM/dd/yyyy').setZone('America/New_York');
  return dt.toFormat('MM/dd/yyyy') + ' EDT';
}
