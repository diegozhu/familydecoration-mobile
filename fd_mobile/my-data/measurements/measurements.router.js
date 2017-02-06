(function() {
  'use strict';

  angular
    .module('fdmobile.measurements')
    .config(measurementsRouter);

  function measurementsRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.myData.measurements',
        url: '/measurements',
        cache: false,
        params: { measurementType: null, measureRightNow: null},
        views: {
          'mydata-measurements': {
            templateUrl: 'my-data/measurements/measurements.html',
            controller: 'MeasurementsController as vm'
          }
        }
      })
      .state({
        name: 'chart',
        url: '/chart/:measurementType',
        cache: false,
        templateUrl: 'my-data/measurements/charts/chart.html',
        controller: 'ChartController as vm'
      });
  }
})();
