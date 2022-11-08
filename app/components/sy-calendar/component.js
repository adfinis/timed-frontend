import { action } from "@ember/object";
import PowerCalendarComponent from "ember-power-calendar/components/power-calendar";
import moment from "moment";

const CURRENT_YEAR = moment().year();

const YEARS_IN_FUTURE = 5;

export default class SyCalendar extends PowerCalendarComponent {
  months = moment.months();

  years = [...new Array(40).keys()].map(
    (i) => `${CURRENT_YEAR + YEARS_IN_FUTURE - i}`
  );

  @action
  changeCenter(unit, calendar, e) {
    const newCenter = moment(calendar.center)[unit](e.target.value);
    calendar.actions.changeCenter(newCenter);
  }
}
