/**
 * Returns the given Date in a formatted string.
 * The format of the string is [YYYY-MM-DD] HH:MM.
 *
 * @param {Date} dt The date to format.
 * @returns {string} The formatted date and time string.
 */
export const getFormattedDateForUI = (dt: Date): string => {
  const padZeros = (n: number): string => n.toString().padStart(2, "0");
  const formattedDate = `[${dt.getFullYear()}-${padZeros(
    dt.getMonth() + 1,
  )}-${padZeros(dt.getDate())}] ${padZeros(dt.getHours())}:${padZeros(dt.getMinutes())}`; //todo
  return formattedDate;
};

/**
 * Returns the current date and time in ISO format.
 *
 * @returns {string} The formatted date and time in ISO format.
 */
export const getFormattedDateForLogs = (): string => {
  return new Date().toISOString();
};