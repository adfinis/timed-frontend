import Test from 'ember-test'

export default Test.registerAsyncHelper(
  'taskSelect',
  async function(app, selector, customer = ':eq(0)', project = ':eq(0)', task = ':eq(0)') {
    let c = find(`${selector} input[name='customer']`)
    let p = find(`${selector} input[name='project']`)
    let t = find(`${selector} input[name='task']`)

    await triggerEvent(`#${c.attr('id')}`, 'focus')
    await click(`#${c.parent().find(`.tt-suggestion${customer}`).children().attr('id')}`)

    await triggerEvent(`#${p.attr('id')}`, 'focus')
    await click(`#${p.parent().find(`.tt-suggestion${project}`).children().attr('id')}`)

    await triggerEvent(`#${t.attr('id')}`, 'focus')
    await click(`#${t.parent().find(`.tt-suggestion${task}`).children().attr('id')}`)
  }
)
