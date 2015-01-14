'use strict';


angular.module('tempMonitorApp')
    .controller('TempSensorCtrl', function ($scope, $interval, $http, socket, $stateParams) {

        window.Highcharts.setOptions({global: { useUTC: false } });


        $scope.message = 'Hello';

        $scope.sensor = [];

        $scope.chartConfig = {
            options: {

                chart: {
                    type: 'area',
                    //zoomType: 'x',
                    animation: window.Highcharts.svg
                }



            },

            series: [],
            title: {
                text: '24 Hour History'
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
                }
            },
            loading: false
        };






        if (!!$stateParams.probeAddress) {
            // try to grab the probe information
            $http.get('/api/temps/'+$stateParams.probeAddress)
                .success(function (data) {
                    // this callback will be called asynchronously
                    // when the response is available

                    $scope.sensor.name = data.name;
                    $scope.sensor.address = data.address;
                    $scope.sensor.readings = [];

                    _.forEach(data.readings, function(reading){
                        var tmpDate =  new Date(reading.createdAt);
                        $scope.sensor.readings.push([tmpDate.getTime(),reading.reading * 9 / 5 + 32]);
                    });

                    $scope.chartConfig.series.push({
                        data: $scope.sensor.readings
                    });

                });


        }


        socket.on('probe:reading', function(reading){

            if(reading.address === $scope.sensor.address) {

                $scope.chartConfig.series[0].data.push([Date.now(),reading.reading * 9 / 5 + 32]);
            }
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('temp');
        });

    });
