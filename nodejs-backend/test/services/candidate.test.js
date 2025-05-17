const assert = require('assert');
const app = require('../../src/app');

describe('\'candidate\' service', () => {
  it('registered the service', () => {
    const service = app.service('candidate');

    assert.ok(service, 'Registered the service (candidate)');
  });
});
