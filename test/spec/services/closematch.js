'use strict';

describe('Service: closeMatch', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var closeMatch;
  beforeEach(inject(function (_closeMatch_) {
    closeMatch = _closeMatch_;
  }));

  it('should do something', function () {
    expect(!!closeMatch).toBe(true);
  });

});
