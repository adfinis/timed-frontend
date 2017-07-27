/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from 'ember-controller'
import computed, { sort } from 'ember-computed-decorators'
import moment from 'moment'

/**
 * Controller to edit an activity
 *
 * @class IndexActivitiesEditController
 * @extends Ember.Controller
 * @public
 */
const IndexActivitiesEditController = Controller.extend({
  /**
   * The sort key by which the blocks should be sorted
   *
   * @property {String[]} sortBy
   * @public
   */
  sortBy: ['from:desc'],

  /**
   * The sorted blocks of the activity
   *
   * @property {ActivitBlock[]} blocks
   * @public
   */
  @sort('activity.blocks.[]', 'sortBy')
  blocks: [],

  /**
   * The total duration of all inactive blocks
   *
   * @property {moment.duration} total
   * @public
   */
  @computed('blocks.@each.{from,to}')
  total(blocks) {
    return blocks.reduce((dur, block) => {
      let { from, to } = block.getProperties('from', 'to')

      if (to) {
        dur.add(to.diff(from))
      }

      return dur
    }, moment.duration())
  }
})

export default IndexActivitiesEditController
