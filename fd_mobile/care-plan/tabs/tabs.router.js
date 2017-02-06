(function() {
  'use strict';

  angular
    .module('fdmobile.carePlan')
    .config(carePlanRouter);

  carePlanRouter.$inject = ['$stateProvider'];

  function carePlanRouter($stateProvider) {
    $stateProvider
      .state('home.carePlan', {
        url: 'careplan',
        abstract: true,
        cache: false,
        views: {
          'tab-care-plan': {
            templateUrl: 'care-plan/tabs/tabs.html'
          }
        }
      });
  }
})();
