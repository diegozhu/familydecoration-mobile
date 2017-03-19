(function() {
  'use strict';

  angular
    .module('fdmobile.measurements')
    .config(measurementsRouter);

  function measurementsRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.plan.measurements',
        url: '/measurements',
        cache: false,
        params: { measurementType: null, measureRightNow: null},
        views: {
          'plan-measurements': {
            templateUrl: 'plan/measurements/measurements.html',
            controller: 'MeasurementsController as vm'
          }
        }
      })
      .state({
        name: 'chart',
        url: '/chart/:measurementType',
        cache: false,
        templateUrl: 'plan/measurements/charts/chart.html',
        controller: 'ChartController as vm'
      });
  }
})();
