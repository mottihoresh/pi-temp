'use strict';

angular.module('tempMonitorApp')
    .controller('TempMonitorCtrl', function ($scope, $interval,$http, socket) {
        $scope.message = 'Hello';

        $scope.sensors = ['bla bla bla', 'bla bla bla'];

        socket.on('probe:update-list', function(probes){
            $scope.sensors = [];
            _.forEach(probes, function(probe){
                $scope.sensors.push({
                    address:probe,
                    reading:0
                });
            });
        });

        socket.on('probe:reading', function(reading){

            var $something = _.find($scope.sensors, function(probe) {

                if(probe.address == reading.address) {
                    probe.reading = reading.reading;
                }

            });



        });

        $http.get('/api/temps').success(function(sensors) {
            $scope.sensors = sensors;
            socket.syncUpdates('temp', $scope.sensors);
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('temp');
        });

    });
