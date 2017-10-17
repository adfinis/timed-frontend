import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | statistic list/label', function() {
  setupComponentTest('statistic-list/label', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#statistic-list/label}}
    //     template content
    //   {{/statistic-list/label}}
    // `);

    this.render(hbs`{{statistic-list/label}}`);
    expect(this.$()).to.have.length(1);
  });
});
