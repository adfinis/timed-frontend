import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | progress tooltip', function() {
  setupComponentTest('progress-tooltip', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#progress-tooltip}}
    //     template content
    //   {{/progress-tooltip}}
    // `);

    this.render(hbs`{{progress-tooltip}}`);
    expect(this.$()).to.have.length(1);
  });
});
