'use strict';

describe('Directive: columnNetworkVis', function () {

  // load the directive's module
  beforeEach(module('globiProtoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<column-network-vis></column-network-vis>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the columnNetworkVis directive');
  }));
});
