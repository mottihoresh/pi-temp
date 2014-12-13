'use strict';

angular.module('tempMonitorApp')
  .directive('temperatureBadge', function () {
    return {
      templateUrl: 'app/directives/temperatureBadge/temperatureBadge.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });