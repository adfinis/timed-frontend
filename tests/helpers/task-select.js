import Test from 'ember-test'

export default Test.registerAsyncHelper('taskSelect', async function(
  app,
  selector,
  options = { fromHistory: false }
) {
  let c = find(`${selector} input[name='customer']`)
  let p = find(`${selector} input[name='project']`)
  let t = find(`${selector} input[name='task']`)

  if (options.fromHistory) {
    await triggerEvent(`#${c.attr('id')}`, 'focus')
    await click(
      `#${c.parent().find('.tt-suggestion:eq(0)').children().attr('id')}`
    )
    return
  }

  await triggerEvent(`#${c.attr('id')}`, 'focus')
  await click(
    `#${c.parent().find('.tt-suggestion:eq(1)').children().attr('id')}`
  )

  await triggerEvent(`#${p.attr('id')}`, 'focus')
  await click(
    `#${p.parent().find('.tt-suggestion:eq(0)').children().attr('id')}`
  )

  await triggerEvent(`#${t.attr('id')}`, 'focus')
  await click(
    `#${t.parent().find('.tt-suggestion:eq(0)').children().attr('id')}`
  )
})
