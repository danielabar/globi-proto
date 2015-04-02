'use strict';

describe('Service: d3Extension', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var d3Extension;
  beforeEach(inject(function (_d3Extension_) {
    d3Extension = _d3Extension_;
  }));

  it('should do something', function () {
    expect(!!d3Extension).toBe(true);
  });

});
