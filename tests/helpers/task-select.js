import Ember from 'ember'

const { Test: { registerAsyncHelper } } = Ember

export default registerAsyncHelper('taskSelect', async function(
  app,
  selector = '',
  options = { fromHistory: false }
) {
  if (options.fromHistory) {
    await selectChoose(
      `${selector} .customer-select`,
      '.ember-power-select-option',
      0
    )

    return
  }

  await selectChoose(
    `${selector} .customer-select`,
    '.ember-power-select-option',
    1
  )
  await selectChoose(
    `${selector} .project-select`,
    '.ember-power-select-option',
    0
  )
  await selectChoose(
    `${selector} .task-select`,
    '.ember-power-select-option',
    0
  )
})
