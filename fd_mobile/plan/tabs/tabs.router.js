(function() {
  'use strict';

  angular
    .module('fdmobile.plan')
    .config(planRouter);

  function planRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.plan',
        url: 'plan',
        // abstract: true,
        views: {
          'tab-plan': {
            templateUrl: 'plan/tabs/tabs.html'
          }
        }
      });
  }
})();
