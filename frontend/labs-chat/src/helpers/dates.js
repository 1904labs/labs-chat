/**
 * Returns the current date and time in a formatted string.
 * The format of the string is [YYYY-MM-DD] HH:MM.
 *
 * @returns {string} The formatted date and time string.
 */
export const getFormattedDateForUI = () => {
  const dt = new Date();
  const formatedDate = `[${dt.getFullYear()}-${
    dt.getMonth() + 1
  }-${dt.getDate()}] ${dt.getHours()}:${dt.getMinutes()}`; //todo
  return formatedDate;
};

/**
 * Returns the current date and time in ISO format.
 *
 * @returns {string} The formatted date and time in ISO format.
 */
export const getFormattedDateForLogs = () => {
  return new Date().toISOString();
};
