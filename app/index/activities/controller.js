/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { sort } from "@ember/object/computed";

/**
 * The index activities controller
 *
 * @class IndexActivitiesController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
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
      return this.get("_allActivities").filter(a => {
        return (
          a.get("date") &&
          a.get("date").isSame(this.get("model"), "day") &&
          a.get("user.id") === this.get("user.id") &&
          !a.get("isNew") &&
          !a.get("isDeleted")
        );
      });
    }
  ),

  sortedActivities: sort("activities", function(a, b) {
    return b.get("from").toDate() - a.get("from").toDate();
  })
});
