/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { reads, sort } from "@ember/object/computed";
import { inject as service } from "@ember/service";

/**
 * The index activities controller
 *
 * @class IndexActivitiesController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  router: service(),

  /**
   * All activities currently in the store
   *
   * @property {Activity[]} _allActivities
   * @private
   */
  _allActivities: computed(function() {
    return this.store.peekAll("activity");
  }),

  /**
   * The ID of the currently selected activity.
   * This is used to add a CSS class for styling.
   *
   * @property {String} editId
   * @public
   */
  editId: reads("router.currentRoute.params.id"),

  /**
   * The activities filtered by the selected day
   *
   * @property {Activity[]} activities
   * @public
   */
  activities: computed(
    "_allActivities.@each.{date,user,isNew,isDeleted}",
    "model",
    "user",
    function() {
      return this.get("_allActivities").filter(activity => {
        return (
          activity.get("date") &&
          activity.get("date").isSame(this.get("model"), "day") &&
          activity.get("user.id") === this.get("user.id") &&
          !activity.get("isNew") &&
          !activity.get("isDeleted")
        );
      });
    }
  ),

  sortedActivities: sort("activities", function(a, b) {
    return b.get("from").toDate() - a.get("from").toDate();
  })
});
