'use strict';

describe('Service: graphService', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var graphService;
  beforeEach(inject(function (_graphService_) {
    graphService = _graphService_;
  }));

  it('should do something', function () {
    expect(!!graphService).toBe(true);
  });

});
