'use strict';

describe('Directive: aboutMenu', function () {

  // load the directive's module
  beforeEach(module('globiProtoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<about-menu></about-menu>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the aboutMenu directive');
  }));
});
