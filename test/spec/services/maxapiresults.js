'use strict';

describe('Service: maxApiResults', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var maxApiResults;
  beforeEach(inject(function (_maxApiResults_) {
    maxApiResults = _maxApiResults_;
  }));

  it('should do something', function () {
    expect(!!maxApiResults).toBe(true);
  });

});
