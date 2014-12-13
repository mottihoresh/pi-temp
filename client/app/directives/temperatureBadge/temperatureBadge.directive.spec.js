'use strict';

describe('Directive: temperatureBadge', function () {

  // load the directive's module and view
  beforeEach(module('tempMonitorApp'));
  beforeEach(module('app/directives/temperatureBadge/temperatureBadge.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<temperature-badge></temperature-badge>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the temperatureBadge directive');
  }));
});