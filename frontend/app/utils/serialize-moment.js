import moment from "moment";

export const DATE_FORMAT = "YYYY-MM-DD";

export function serializeMoment(momentObject) {
  if (momentObject) {
    momentObject = moment(momentObject);
  }
  return (momentObject && momentObject.format(DATE_FORMAT)) || null;
}
export function deserializeMoment(momentString) {
  return (momentString && moment(momentString, DATE_FORMAT)) || null;
}
