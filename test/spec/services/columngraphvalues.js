'use strict';

describe('Service: columnGraphValues', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var columnGraphValues;
  beforeEach(inject(function (_columnGraphValues_) {
    columnGraphValues = _columnGraphValues_;
  }));

  it('should do something', function () {
    expect(!!columnGraphValues).toBe(true);
  });

});
