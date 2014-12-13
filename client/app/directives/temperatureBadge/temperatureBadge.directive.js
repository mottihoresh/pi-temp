'use strict';

angular.module('tempMonitorApp')
    .directive('temperatureBadge', function () {
        return {
            templateUrl: 'app/directives/temperatureBadge/temperatureBadge.html',
            restrict: 'EA',
            scope: { sensor: '=temperatureBadge' },
            link: function (scope, element, attrs) {

                scope.$watch('sensor', function(walks) {
                    //console.log(scope.sensor, walks);
                });

            }
        };
    });

