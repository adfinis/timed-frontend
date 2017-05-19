import { expect }              from 'chai'
import { describe, it }        from 'mocha'
import EmberObject             from 'ember-object'
import TaskSelectionRouteMixin from 'timed/mixins/task-selection-route'

describe('Unit | Mixin | task selection route', function() {
  it('works', function() {
    let TaskSelectionRouteObject = EmberObject.extend(TaskSelectionRouteMixin)
    let subject = TaskSelectionRouteObject.create()
    expect(subject).to.be.ok
  })
})
