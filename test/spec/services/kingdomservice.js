'use strict';

describe('Service: kingdomService', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var kingdomService;
  beforeEach(inject(function (_kingdomService_) {
    kingdomService = _kingdomService_;
  }));

  it('should do something', function () {
    expect(!!kingdomService).toBe(true);
  });

});
