import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | statistic list/bar', function() {
  setupComponentTest('statistic-list/bar', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#statistic-list/bar}}
    //     template content
    //   {{/statistic-list/bar}}
    // `);

    this.render(hbs`{{statistic-list/bar}}`);
    expect(this.$()).to.have.length(1);
  });
});
