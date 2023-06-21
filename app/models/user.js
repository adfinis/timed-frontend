/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import { inject as service } from "@ember/service";
import Model, { attr, hasMany } from "@ember-data/model";
import moment from "moment";
/**
 * The user model
 *
 * @class User
 * @extends DS.Model
 * @public
 */
export default class User extends Model {
  @service store;
  /**
   * The username
   *
   * @property {String} username
   * @public
   */
  @attr("string") username;

  /**
   * The first name
   *
   * @property {String} firstName
   * @public
   */
  @attr("string") firstName;

  /**
   * The last name
   *
   * @property {String} lastName
   * @public
   */
  @attr("string") lastName;

  /**
   * The email address
   *
   * @property {String} email
   * @public
   */
  @attr("string") email;

  /**
   * Defines if the user is a superuser
   *
   * @property {Boolean} isSuperuser
   * @public
   */
  @attr("boolean") isSuperuser;

  /**
   * Whether a user is active
   *
   * @property {Boolean} isActive
   * @public
   */
  @attr("boolean") isActive;

  /**
   * Whether the user is a reviewer in a project
   *
   * @property {Boolean} isReviewer
   * @public
   */
  @attr("boolean") isReviewer;

  /**
   * Whether the user is an accountant
   */
  @attr("boolean", { defaultValue: false }) isAccountant;

  /**
   * Whether the user completed the app tour
   *
   * @property {Boolean} tourDone
   * @public
   */
  @attr("boolean") tourDone;

  /**
   * The users supervisors
   *
   * @property {User[]} supervisors
   * @public
   */
  @hasMany("user", { inverse: "supervisees" }) supervisors;

  /**
   * The users supervisees
   *
   * @property {User[]} supervisees
   * @public
   */
  @hasMany("user", { inverse: "supervisors" }) supervisees;

  /**
   * The users employments
   *
   * @property {Employment[]} employments
   * @public
   */
  @hasMany("employment") employments;

  /**
   * The users worktime balances
   *
   * @property {WorktimeBalance[]} worktimeBalances
   * @public
   */
  @hasMany("worktime-balances") worktimeBalances;

  /**
   * The users absence balances
   *
   * @property {AbsenceBalance[]} absenceBalances
   * @public
   */
  @hasMany("absence-balance") absenceBalances;

  /**
   * The full name
   *
   * Consists of the first and last name
   *
   * @property {String} fullName
   * @public
   */
  get fullName() {
    if (!this.firstName && !this.lastName) {
      return "";
    }

    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * The long name
   *
   * Consists of the full name and the username. If no full name is given, only
   * the username is returned
   *
   * @property {String} longName
   * @public
   */
  get longName() {
    return this.fullName
      ? `${this.fullName} (${this.username})`
      : this.username;
  }

  /**
   * The active employment
   *
   * An employment is active as soon as it doesn't have a to date
   *
   * @property {Employment} activeEmployment
   * @public
   */
  get activeEmployment() {
    return (
      this.store.peekAll("employment").find((e) => {
        return (
          e.get("user.id") === this.id &&
          (!e.get("end") || e.get("end").isSameOrAfter(moment.now(), "day"))
        );
      }) || null
    );
  }

  /**
   * The current worktime balance
   *
   * @property {WorktimeBalance} currentWorktimeBalance
   * @public
   */
  get currentWorktimeBalance() {
    return (
      this.store.peekAll("worktime-balance").find((balance) => {
        return (
          balance.get("user.id") === this.id &&
          balance.get("date").isSame(moment(), "day")
        );
      }) || null
    );
  }
}
