'use strict';

describe('Service: legendHelper', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var legendHelper;
  beforeEach(inject(function (_legendHelper_) {
    legendHelper = _legendHelper_;
  }));

  it('should do something', function () {
    expect(!!legendHelper).toBe(true);
  });

});
