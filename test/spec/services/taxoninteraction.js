'use strict';

describe('Service: taxonInteraction', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var taxonInteraction;
  beforeEach(inject(function (_taxonInteraction_) {
    taxonInteraction = _taxonInteraction_;
  }));

  it('should do something', function () {
    expect(!!taxonInteraction).toBe(true);
  });

});
