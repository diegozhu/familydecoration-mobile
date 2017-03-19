(function() {
  'use strict';

  angular
    .module('fdmobile.intake')
    .config(intakeRouter);

  function intakeRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.plan.intake',
        url: '/intake',
        cache: false,
        views: {
          'plan-intake': {
            templateUrl: 'plan/intake/intake.html',
            controller: 'IntakeController as vm'
          }
        }
      });
  }
})();
