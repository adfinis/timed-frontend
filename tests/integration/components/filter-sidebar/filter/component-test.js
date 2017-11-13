import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { click, findAll, find, fillIn } from 'ember-native-dom-helpers'
import moment from 'moment'

describe('Integration | Component | filter sidebar/filter', function() {
  setupComponentTest('filter-sidebar/filter', {
    integration: true
  })

  it('works with type button', function() {
    this.setProperties({
      options: [
        { id: 1, label: 'test 1' },
        { id: 2, label: 'test 2' },
        { id: 3, label: 'test 3' }
      ],
      selected: 2
    })

    this.render(hbs`
      {{filter-sidebar/filter 'button'
        selected=selected
        options=options
        valuePath='id'
        labelPath='label'
        on-change=(action (mut selected))
      }}
    `)

    expect(findAll('button')).to.have.length(3)

    expect(findAll('button').map(b => b.innerHTML.trim())).to.deep.equal([
      'test 1',
      'test 2',
      'test 3'
    ])

    expect(find('button.active').innerHTML.trim()).to.equal('test 2')

    click('button:nth-child(1)')

    expect(this.get('selected')).to.equal(1)
  })

  it('works with type select', function() {
    this.setProperties({
      options: [
        { id: 1, label: 'test 1' },
        { id: 2, label: 'test 2' },
        { id: 3, label: 'test 3' }
      ],
      selected: 2
    })

    this.render(hbs`
      {{filter-sidebar/filter 'select'
        selected=selected
        options=options
        valuePath='id'
        labelPath='label'
        on-change=(action (mut selected))
      }}
    `)

    expect(findAll('option')).to.have.length(3)

    expect(findAll('option').map(b => b.innerHTML.trim())).to.deep.equal([
      'test 1',
      'test 2',
      'test 3'
    ])
    expect(
      findAll('option')[find('select').options.selectedIndex].innerHTML.trim()
    ).to.equal('test 2')

    fillIn('select', '1')

    expect(this.get('selected')).to.equal('1')
  })

  it('works with type date', function() {
    this.set('selected', moment({ year: 2017, month: 10, day: 1 }))

    this.render(hbs`
      {{filter-sidebar/filter 'date'
        selected=selected
        on-change=(action (mut selected))
      }}
    `)

    expect(find('input').value).to.equal(
      this.get('selected').format('DD.MM.YYYY')
    )

    fillIn('input', '10.10.2010')

    expect(this.get('selected').format()).to.equal(
      moment({ year: 2010, month: 9, day: 10 }).format()
    )
  })

  it('works with type search', function() {
    this.set('selected', 'foobar')

    this.render(hbs`
      {{filter-sidebar/filter 'search'
        selected=selected
        on-change=(action (mut selected))
      }}
    `)

    expect(find('input').value).to.equal(this.get('selected'))

    fillIn('input', 'foobarbaz')

    expect(this.get('selected')).to.equal('foobarbaz')
  })

  it('works with block style', function() {
    this.render(hbs`
      {{#filter-sidebar/filter}}
        Works
      {{/filter-sidebar/filter}}
    `)

    expect(find('div').innerHTML).to.contain('Works')
  })
})
