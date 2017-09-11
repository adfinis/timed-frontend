/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import service from 'ember-service/inject'

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  tracking: service('tracking'),

  classNames: ['tracking-bar']
})
