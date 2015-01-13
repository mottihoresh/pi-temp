'use strict';


angular.module('tempMonitorApp')
    .controller('TempSensorCtrl', function ($scope, $interval, $http, socket, $stateParams) {

        Highcharts.setOptions({global: { useUTC: false } });


        $scope.message = 'Hello';

        $scope.sensor = [];

        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                }
            },
            series: [],
            title: {
                text: 'Hello'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date/Time'
                }
            },
            yAxis: {
                title: {
                    text: 'Temperature'
                },
                min: 0
            },
            loading: false
        };

        if (!!$stateParams.probeAddress) {
            // try to grab the probe information
            $http.get('/api/temps/'+$stateParams.probeAddress)
                .success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    $scope.sensor.name = data.name;
                    $scope.sensor.address = data.address;
                    $scope.sensor.readings = [];

                    _.forEach(data.readings, function(reading){
                        var tmpDate =  new Date(reading.createdAt);
                        $scope.sensor.readings.push([tmpDate.getTime(),reading.reading]);
                    });

                    $scope.chartConfig.series.push({
                        data: $scope.sensor.readings
                    });

                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        }


        socket.on('probe:reading', function(reading){

            if(reading.address == $scope.sensor.address) {

                $scope.chartConfig.series[0].data.push([Date.now(),reading.reading]);
            }
            //_.find($scope.sensors, function(probe) {
            //
            //    if(probe.address === reading.address) {
            //        probe.reading = reading.reading;
            //    }
            //
            //});
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('temp');
        });

    });
