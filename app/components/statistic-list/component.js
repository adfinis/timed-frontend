import Component from '@ember/component'
import { get } from '@ember/object'
import computed from 'ember-computed-decorators'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { capitalize } from '@ember/string'

const PLAIN_LAYOUT = hbs`{{value}}`
const DURATION_LAYOUT = hbs`{{humanize-duration value false}}`
const MONTH_LAYOUT = hbs`{{moment-format (moment value 'M') 'MMMM'}}`

const COLUMN_MAP = {
  year: [
    { title: 'Year', path: 'year', layout: PLAIN_LAYOUT },
    { title: 'Duration', path: 'duration', layout: DURATION_LAYOUT }
  ],
  month: [
    { title: 'Year', path: 'year', layout: PLAIN_LAYOUT },
    { title: 'Month', path: 'month', layout: MONTH_LAYOUT },
    { title: 'Duration', path: 'duration', layout: DURATION_LAYOUT }
  ],
  customer: [
    { title: 'Customer', path: 'customer.name', layout: PLAIN_LAYOUT },
    { title: 'Duration', path: 'duration', layout: DURATION_LAYOUT }
  ],
  project: [
    { title: 'Customer', path: 'project.customer.name', layout: PLAIN_LAYOUT },
    { title: 'Project', path: 'project.name', layout: PLAIN_LAYOUT },
    {
      title: 'Estimated',
      path: 'project.estimatedTime',
      layout: DURATION_LAYOUT
    },
    { title: 'Duration', path: 'duration', layout: DURATION_LAYOUT }
  ],
  task: [
    {
      title: 'Customer',
      path: 'task.project.customer.name',
      layout: PLAIN_LAYOUT
    },
    { title: 'Project', path: 'task.project.name', layout: PLAIN_LAYOUT },
    { title: 'Task', path: 'task.name', layout: PLAIN_LAYOUT },
    { title: 'Estimated', path: 'task.estimatedTime', layout: DURATION_LAYOUT },
    { title: 'Duration', path: 'duration', layout: DURATION_LAYOUT }
  ],
  user: [
    {
      title: 'User',
      path: 'user.fullName',
      ordering: 'user__username',
      layout: PLAIN_LAYOUT
    },
    { title: 'Duration', path: 'duration', layout: DURATION_LAYOUT }
  ]
}

export default Component.extend({
  @computed('data.lastSuccessful.value.@each.duration')
  maxDuration(data) {
    return data && moment.duration(Math.max(...data.mapBy('duration')))
  },

  @computed('type')
  columns(type) {
    return get(COLUMN_MAP, type).map(col => ({
      ...col,
      ordering: col.ordering || col.path.replace(/\./g, '__')
    }))
  },

  @computed('missingParams.[]')
  missingParamsMessage(params) {
    let text = params
      .map((param, index) => {
        if (index === 0) {
          param = capitalize(param)
        }

        if (params.length > 1) {
          if (index + 1 === params.length) {
            param = `and ${param}`
          } else if (index + 2 !== params.length) {
            param = `${param},`
          }
        }

        return param
      })
      .join(' ')

    let suffix =
      params.length > 1 ? 'are required parameters' : 'is a required parameter'

    return `${text} ${suffix} for this statistic`
  }
})
