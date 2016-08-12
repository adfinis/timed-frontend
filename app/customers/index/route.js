import Route          from 'ember-route'
import ListRouteMixin from 'timed/mixins/list-route'

export default Route.extend(ListRouteMixin, {
  modelName: 'customer'
})
