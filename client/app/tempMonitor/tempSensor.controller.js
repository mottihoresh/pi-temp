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
                    zoomType: 'x'
                },

                plotOptions: {
                    area: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                }

            },

            //useHighStocks: true,

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


        $scope.nv3ChartData = [
            {
                values: [],
                key: 'Another sine wave',
                color: '#7777ff'
                //area: true      //area - set to true if you want this line to turn into a filled area chart.
            }
        ];

        $scope.nv3ChartOptions = {
            chart: {
                type: 'linePlusBarWithFocusChart',
                height: 500,
                margin: {
                    top: 30,
                    right: 75,
                    bottom: 50,
                    left: 75
                },
                bars: {
                    forceY: [0]
                },
                bars2: {
                    forceY: [0]
                },
                color: ['#2ca02c', 'darkred'],
                x: function(d,i) { return i },
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        var dx = $scope.nv3ChartData[0].values[d] && $scope.nv3ChartData[0].values[d].x || 0;
                        if (dx > 0) {
                            return d3.time.format('%X')(new Date(dx))
                        }
                        return null;
                    }
                },
                x2Axis: {
                    tickFormat: function(d) {
                        var dx = $scope.nv3ChartData[0].values[d] && $scope.nv3ChartData[0].values[d].x || 0;
                        return d3.time.format('%H:%M')(new Date(dx))
                    },
                    showMaxMin: false
                },
                y1Axis: {
                    axisLabel: 'Y1 Axis',
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                y2Axis: {
                    axisLabel: 'Y2 Axis',
                    tickFormat: function(d) {
                        return '$' + d3.format(',.2f')(d)
                    }
                },
                y3Axis: {
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                y4Axis: {
                    tickFormat: function(d) {
                        return '$' + d3.format(',.2f')(d)
                    }
                }
            }
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
                        $scope.nv3ChartData[0].values.push({x:tmpDate.getTime(), y:reading.reading * 9 / 5 + 32})
                    });

                    $scope.chartConfig.series.push({
                        data: $scope.sensor.readings
                    });

                });


        }


        socket.on('probe:reading', function(reading){

            if(reading.address === $scope.sensor.address) {

                $scope.chartConfig.series[0].data.push([Date.now(),reading.reading * 9 / 5 + 32]);
                $scope.nv3ChartData[0].values.push({x:Date.now(), y:reading.reading * 9 / 5 + 32});
            }
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('temp');
        });

    });
