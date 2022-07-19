export default [
  {
    target: ".tracking-bar",
    placement: "bottom",
    title: "Tracking activities",
    content: `
    <p>
      Activities do not count as your worktime. They are only a help for you to
      track your daily work. However, at the end of the day you can generate
      your timesheet based on your activities. But we will get to that later.
    </p>
    <p>
      One thing to note here is that those long customers with the icons are
      your recently used tasks. If you select one of them it will automatically
      fill the other dropdowns. This might come in handy.
    </p>
    <p>
      Let's begin by starting a new activity! Select a task of your choice,
      enter a comment and hit the start button.
    </p>
    `,
  },
  {
    target: ".table--activities",
    placement: "top",
    title: "Activity list",
    content: `
    <p>
      Here you have the list of all tracked activities today. Your started
      activity from before should appear right below.
    </p>
    <p>
      You can start or stop the listed activities with the buttons at the end
      of the row. Or edit them by clicking on it.
    </p>
    `,
  },
  {
    target: ".btn-toolbar .btn-success",
    placement: "left",
    title: "Generating the timesheet",
    content: `
    <p>
      Finally, you can generate your timesheet by clicking here.
    </p>
    <p>
      What will happen is, that the activities will be rounded to 15 minutes.
      Activities without a task will be ignored. So be sure to assign a task before doing this.
    </p>
    <p>
      This can be done a desired number of times. The already existing
      timesheet entries will simply be updated.
    </p>
    <p>
      Go ahead and try it!
    </p>
    `,
  },
];
