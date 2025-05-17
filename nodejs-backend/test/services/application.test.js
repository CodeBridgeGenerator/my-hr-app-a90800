const assert = require('assert');
const app = require('../../src/app');

describe('\'application\' service', () => {
  it('registered the service', () => {
    const service = app.service('application');

    assert.ok(service, 'Registered the service (application)');
  });
});
