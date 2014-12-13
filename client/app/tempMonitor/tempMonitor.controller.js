'use strict';

angular.module('tempMonitorApp')
    .controller('TempMonitorCtrl', function ($scope, $interval) {
        $scope.message = 'Hello';

        $scope.sensors = [];


        $interval(function(){
            _.each($scope.sensors, function(sensor, index){
                $scope.sensors[index].reading = Math.floor(Math.random()*100);
            });

        },1000);

    });
