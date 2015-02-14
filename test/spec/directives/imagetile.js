'use strict';

describe('Directive: imageTile', function () {

  // load the directive's module
  beforeEach(module('globiProtoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<image-tile></image-tile>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imageTile directive');
  }));
});
