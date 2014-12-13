'use strict';

angular.module('tempMonitorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tempMonitor', {
        url: '/',
        templateUrl: 'app/tempMonitor/tempMonitor.html',
        controller: 'TempMonitorCtrl'
      });
  });