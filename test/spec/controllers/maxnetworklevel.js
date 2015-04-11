'use strict';

describe('Controller: MaxnetworklevelCtrl', function () {

  // load the controller's module
  beforeEach(module('globiProtoApp'));

  var MaxnetworklevelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaxnetworklevelCtrl = $controller('MaxnetworklevelCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
