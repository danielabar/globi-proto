'use strict';

describe('Service: interactionService', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var interactionService;
  beforeEach(inject(function (_interactionService_) {
    interactionService = _interactionService_;
  }));

  it('should do something', function () {
    expect(!!interactionService).toBe(true);
  });

});
