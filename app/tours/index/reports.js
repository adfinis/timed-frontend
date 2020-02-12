export default [
  {
    target: ".table--reports",
    placement: "top",
    title: "Timesheet",
    content: `
    <p>
      Good job, you created your first timesheet!
    </p>
    <p>
      Here you can edit your generated timesheet as desired. However, the
      changes you apply here will be overwritten when generating the timesheet
      again.
    </p>
    `
  },
  {
    target: ".table--reports input[name=duration]",
    placement: "top",
    title: "Duration",
    content: `
    <p>
      Editing should be easy! That's why the duration can easily be changed by
      pressing the up and down arrow keys which automatically add or subtract
      15 minutes. By simultaneously pressing Shift or Ctrl it adds or subtracts
      an hour instead.
    </p>
    `
  },
  {
    target: ".table--reports",
    placement: "bottom",
    title: "New entry",
    content: `
    <p>
      To add a new entry simply fill out the last row and save it. It will
      automatically generate a new empty row which then can be filled again.
    </p>
    `
  },
  {
    target: ".btn-toolbar .btn-success",
    placement: "left",
    title: "Reschedule",
    content: `
    <p>
      If you created your timesheet on the wrong day you can transfer it by
      clicking the reschedule button and selecting the correct day.
    </p>
    `
  },
  {
    target: ".nav-tabs li:nth-child(2)",
    placement: "top",
    title: "Attendance",
    content: `
    <p>
      Now you know how the timesheet works. Let's continue by managing your
      attendances. See you there!
    </p>
    `
  }
];
