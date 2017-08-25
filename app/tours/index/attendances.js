export default [
  {
    target: '.btn-toolbar .btn-success',
    placement: 'left',
    title: 'Add attendance',
    content: `
    Attendances represent time blocks in which you were at the workplace. They
    don't count as worktime but are a help for you to roughly guess the
    worktime you should have.
    <br>
    To add a new attendance just click this button.
    `
  },
  {
    target: '.tab-content .visible-md',
    placement: 'top',
    title: 'Edit attendance',
    content: `
    Now you can just adjust the time block by grabing and moving it or grabing
    on end and adjusting the start or end time. The attendance saves
    automatically after every change.
    <br>
    You can have as many attendances per day as you want.
    `
  }
]
