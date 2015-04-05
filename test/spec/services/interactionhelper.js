'use strict';

describe('Service: interactionHelper', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var interactionHelper;
  beforeEach(inject(function (_interactionHelper_) {
    interactionHelper = _interactionHelper_;
  }));

  it('should do something', function () {
    expect(!!interactionHelper).toBe(true);
  });

});
