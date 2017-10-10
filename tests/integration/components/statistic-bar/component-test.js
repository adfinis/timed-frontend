import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | statistic bar', function() {
  setupComponentTest('statistic-bar', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#statistic-bar}}
    //     template content
    //   {{/statistic-bar}}
    // `);

    this.render(hbs`{{statistic-bar}}`);
    expect(this.$()).to.have.length(1);
  });
});
