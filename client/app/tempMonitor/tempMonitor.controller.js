'use strict';

angular.module('tempMonitorApp')
    .controller('TempMonitorCtrl', function ($scope, $interval,$http, socket) {
        $scope.message = 'Hello';

        $scope.sensors = [];

        socket.on('hello-world', function(data){
            console.log('awesome stuff, here\'s some data');
        });

        $http.get('/api/temps').success(function(sensors) {
            $scope.sensors = sensors;
            socket.syncUpdates('temp', $scope.sensors);
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('temp');
        });

        $interval(function(){
            _.each($scope.sensors, function(sensor, index){
                $scope.sensors[index].reading = Math.floor(Math.random()*100);
            });

        },1000);

    });
