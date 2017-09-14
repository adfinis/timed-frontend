import Ember from 'ember'

const { Test: { registerAsyncHelper } } = Ember

export default registerAsyncHelper('userSelect', async function(
  app,
  selector = ''
) {
  await selectChoose(
    `${selector} .user-select`,
    '.ember-power-select-option',
    0
  )
})
