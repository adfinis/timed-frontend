/**
 * @module timed
 * @submodule timed-mixins
 * @public
 */
import Mixin from 'ember-metal/mixin'

/**
 * A mixin to create a page which filters reports by given values
 *
 * This is used in combination with @see ReportFilterControllerMixin
 *
 * @class ReportFilterRouteMixin
 * @extends Ember.Mixin
 * @public
 */
export default Mixin.create({
  /**
   * The query params for the page
   *
   * @property {Object} queryParams
   * @public
   */
  queryParams: {
    customer: { refreshModel: true },
    project: { refreshModel: true },
    task: { refreshModel: true },
    user: { refreshModel: true },
    from_date: { refreshModel: true }, // eslint-disable-line camelcase
    to_date: { refreshModel: true }, // eslint-disable-line camelcase
    page_size: { refreshModel: true }, // eslint-disable-line camelcase
    page: { refreshModel: true },
    ordering: { refreshModel: true }
  },

  /**
   * Before model hook, fetch the given customer, project, task or user
   *
   * @method beforeModel
   * @param {Ember.Transition} The transition
   * @public
   */
  async beforeModel({ queryParams: { customer, project, task, user } }) {
    this._super(...arguments)

    if (task) {
      await this.store.findRecord('task', task, {
        include: 'project,project.customer'
      })
    } else if (project) {
      await this.store.findRecord('project', project, { include: 'customer' })
    } else if (customer) {
      await this.store.findRecord('customer', customer)
    }

    if (user) {
      await this.store.findRecord('user', user)
    }
  },

  /**
   * Model hook, fetch the filtered reports
   *
   * @method model
   * @param {Object} params The filter parameters
   * @return {Report[]} The filtered reports
   * @public
   */
  model(params) {
    let filterValues = Object.keys(params).reduce((values, key) => {
      if (!['page', 'page_size', 'ordering'].includes(key)) {
        values.push(params[key])
      }

      return values
    }, [])

    return filterValues.any(arg => !!arg)
      ? this.store.query('report', {
          include: 'task,task.project,task.project.customer,user',
          ...params
        })
      : null
  },

  /**
   * Setup controller hook, set the customer, project, task or user and the
   * currently logged in user.
   *
   * @method setupController
   * @param {Controller} controller The controller
   * @public
   */
  setupController(controller) {
    this._super(...arguments)

    let customerId = controller.get('customer')
    let projectId = controller.get('project')
    let taskId = controller.get('task')
    let userId = controller.get('user')

    controller.setProperties({
      _task: taskId && this.store.peekRecord('task', taskId),
      _project: projectId && this.store.peekRecord('project', projectId),
      _customer: customerId && this.store.peekRecord('customer', customerId),
      _user: userId && this.store.peekRecord('user', userId),
      currentUser: this.modelFor('protected')
    })
  }
})
