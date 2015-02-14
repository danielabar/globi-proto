'use strict';

describe('Controller: ImagetileCtrl', function () {

  // load the controller's module
  beforeEach(module('globiProtoApp'));

  var ImagetileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImagetileCtrl = $controller('ImagetileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
