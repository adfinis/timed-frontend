import Test from 'ember-test'

export default Test.registerAsyncHelper('userSelect', async function(
  app,
  selector = ''
) {
  await selectChoose(
    `${selector} .user-select`,
    '.ember-power-select-option',
    0
  )
})
