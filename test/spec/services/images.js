'use strict';

describe('Service: images', function () {

  // load the service's module
  beforeEach(module('globiProtoApp'));

  // instantiate service
  var images;
  beforeEach(inject(function (_images_) {
    images = _images_;
  }));

  it('should do something', function () {
    expect(!!images).toBe(true);
  });

});
