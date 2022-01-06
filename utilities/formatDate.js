/**
 *
 * @param {String} date - date that comes from mongodb documents
 */

export const formatDate = (date) =>
  date.split(".")[0].slice(0, -3).replaceAll("-", ":").replace("T", " ");
