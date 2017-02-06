(function() {
  'use strict';

  angular
    .module('fdmobile.medication')
    .config(medicationRouter);

  medicationRouter.$inject = ['$stateProvider'];

  function medicationRouter($stateProvider) {
    $stateProvider.state('home.carePlan.medication', {
      url: '/medication',
      cache: false,
      views: {
        'careplan-medication': {
          templateUrl: 'care-plan/medication/medication-careplan.html',
          controller: 'MedicationCarePlanController as vm'
        }
      }
    })
    .state('medicationorder', {
      cache: false,
      url: '/medication-order',
      params: {
        carePlan: '@carePlan',
        activity: '@activity',
        from: '@from'
      },
      templateUrl: 'care-plan/medication/medication-order.html',
      controller: 'MedicationOrderController as vm'
    })
    .state('medicationdict', {
      url: '/medicationdict',
      cache: false,
      templateUrl: 'care-plan/medication/medication-dict.html',
      controller: 'MedicationDictController as vm'
    });
  }
})();
