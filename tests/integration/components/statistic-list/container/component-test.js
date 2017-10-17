import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | statistic list/container', function() {
  setupComponentTest('statistic-list/container', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#statistic-list/container}}
    //     template content
    //   {{/statistic-list/container}}
    // `);

    this.render(hbs`{{statistic-list/container}}`);
    expect(this.$()).to.have.length(1);
  });
});
