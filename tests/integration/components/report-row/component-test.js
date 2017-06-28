import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | report row', function() {
  setupComponentTest('report-row', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#report-row}}
    //     template content
    //   {{/report-row}}
    // `);

    this.render(hbs`{{report-row}}`);
    expect(this.$()).to.have.length(1);
  });
});
