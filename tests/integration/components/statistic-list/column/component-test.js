import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | statistic list/column', function() {
  setupComponentTest('statistic-list/column', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#statistic-list/column}}
    //     template content
    //   {{/statistic-list/column}}
    // `);

    this.render(hbs`{{statistic-list/column}}`);
    expect(this.$()).to.have.length(1);
  });
});
