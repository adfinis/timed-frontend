import Test from 'ember-test'

export default Test.registerAsyncHelper('userSelect', async function(
  app,
  selector,
  user = ':eq(0)'
) {
  let i = find(`${selector} input[name='user']`)

  await triggerEvent(`#${i.attr('id')}`, 'focus')
  await click(
    `#${i.parent().find(`.tt-suggestion${user}`).children().attr('id')}`
  )
})
