'use strict';

describe('Service: interactionTypes', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var interactionTypes;
  beforeEach(inject(function (_interactionTypes_) {
    interactionTypes = _interactionTypes_;
  }));

  it('should do something', function () {
    expect(!!interactionTypes).toBe(true);
  });

});
