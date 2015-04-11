'use strict';

describe('Controller: NavnetworkCtrl', function () {

  // load the controller's module
  beforeEach(module('globiProtoApp'));

  var NavnetworkCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavnetworkCtrl = $controller('NavnetworkCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
