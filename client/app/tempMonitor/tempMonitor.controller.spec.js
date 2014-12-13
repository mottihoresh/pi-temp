'use strict';

describe('Controller: TempMonitorCtrl', function () {

  // load the controller's module
  beforeEach(module('tempMonitorApp'));

  var TempMonitorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TempMonitorCtrl = $controller('TempMonitorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
