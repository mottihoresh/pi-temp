'use strict';

angular.module('tempMonitorApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tempMonitor', {
                url: '/',
                templateUrl: 'app/tempMonitor/tempMonitor.html',
                controller: 'TempMonitorCtrl'
            })
            .state('tempSensorPage', {
                url: '/:probeAddress',
                templateUrl: 'app/tempMonitor/tempSensor.html',
                controller: 'TempSensorCtrl'
            })
        ;
    });


//.state('contacts.detail', {
//    url: "/contacts/:contactId",
//    templateUrl: 'contacts.detail.html',
//    controller: function ($stateParams) {
//        // If we got here from a url of /contacts/42
//        expect($stateParams).toBe({contactId: "42"});
//    }
//})