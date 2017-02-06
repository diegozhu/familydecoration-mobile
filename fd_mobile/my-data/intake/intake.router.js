(function() {
  'use strict';

  angular
    .module('fdmobile.intake')
    .config(intakeRouter);

  function intakeRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.myData.intake',
        url: '/intake',
        cache: false,
        views: {
          'mydata-intake': {
            templateUrl: 'my-data/intake/intake.html',
            controller: 'IntakeController as vm'
          }
        }
      });
  }
})();
