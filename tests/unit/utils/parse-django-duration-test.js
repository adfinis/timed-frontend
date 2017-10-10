import { expect } from 'chai';
import { describe, it } from 'mocha';
import parseDjangoDuration from 'timed/utils/parse-django-duration';

describe('Unit | Utility | parse django duration', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = parseDjangoDuration();
    expect(result).to.be.ok;
  });
});
