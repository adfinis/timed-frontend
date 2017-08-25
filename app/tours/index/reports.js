export default [
  {
    target: '.table--reports',
    placement: 'top',
    title: 'Timesheet',
    content: `
    You can edit your generated timesheet as desired.However, the changes you
    apply here will be overwritten when generating the timesheet again.
    `
  },
  {
    target: '.table--reports input[name=duration]',
    placement: 'top',
    title: 'Duration',
    content: `
    The duration can easily be changed by pressing the arrow keys which
    automatically add or subtract 15 minutes. By simultaneously pressing Shift
    or Ctrl it adds or subtracts an hour instead.
    `
  },
  {
    target: '.table--reports',
    placement: 'bottom',
    title: 'New entry',
    content: `
    To add a new entry simply fill out the last row and save it. It will
    automatically generate a new empty row which can be filled.
    `
  },
  {
    target: '.btn-toolbar .btn-success',
    placement: 'left',
    title: 'Reschedule',
    content: `
    If you created your timesheet on a wrong day you can transfer it by
    clicking the reschedule button and selecting the correct day.
    `
  }
]
