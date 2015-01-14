'use strict';

angular.module('tempMonitorApp')
    .controller('TempMonitorCtrl', function ($scope, $interval,$http, socket) {
        $scope.message = 'Hello';

        $scope.sensors = [];

        console.log($scope.sensors);
        socket.on('probe:update-list', function(probes){

            // first lets remove any probes that are no longer presnet
            // in the new probes list

            _.find($scope.sensors, function(sensor){
                console.log(sensor);
            });

            _.forEach(probes, function(probe){
                // check if probe is not in the list, if it's not there
                // then add it.
                if(!_.find($scope.sensors, function(sensor){
                    return sensor.address === probe;
                })) {
                    $scope.sensors.push({
                        address:probe
                    });
                }

            });
        });

        socket.on('probe:reading', function(reading){

            _.find($scope.sensors, function(probe) {

                if(probe.address === reading.address) {
                    probe.reading = reading.reading * 5 / 9 + 32;
                }

            });
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('temp');
        });

    });
