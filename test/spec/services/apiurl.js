'use strict';

describe('Service: apiUrl', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var apiUrl;
  beforeEach(inject(function (_apiUrl_) {
    apiUrl = _apiUrl_;
  }));

  it('should do something', function () {
    expect(!!apiUrl).toBe(true);
  });

});
