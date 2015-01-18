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
                color: '#7777ff',
                //area: true      //area - set to true if you want this line to turn into a filled area chart.
            }
        ];

        $scope.nv3ChartOptions = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
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
