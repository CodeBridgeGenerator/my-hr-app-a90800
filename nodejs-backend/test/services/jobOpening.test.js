const assert = require('assert');
const app = require('../../src/app');

describe('\'jobOpening\' service', () => {
  it('registered the service', () => {
    const service = app.service('jobOpening');

    assert.ok(service, 'Registered the service (jobOpening)');
  });
});
