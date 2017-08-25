export default [
  {
    target: '.record-button-container',
    placement: 'bottom',
    title: 'Tracking activities',
    content: `
    First select a customer, project and task. Customers following a special
    icon are your recently used task and will fill all three dropdowns on
    selection.
    <br>
    Then enter a comment which describes the work you do on
    this task and finally, press enter or click on the play button. You can
    stop the activity again by clicking the same button which should now
    contain a stop icon.
    <br>
    A new row in the table below should now appear.`
  },
  {
    target: '.table--activities',
    placement: 'top',
    title: 'Activity list',
    content: `You can start or stop the listed activities with the buttons at
    the end of the row.
    <br>
    To edit them, simply click on it.`
  },
  {
    target: '.btn-toolbar .btn-success',
    placement: 'left',
    title: 'Generating the timesheet',
    content: `Activities do not count as your worktime. They are only a help for
    you. However, at the end of the day you can generate your timesheet based
    on your activities. The activities will be rounded to 15 minutes precise.
    Activities without a task will be ignored. So be sure to assign a task
    before doing this. This can be done a desired number of times. The already
    existing timesheet entries will simply be updated.
    `
  }
]
