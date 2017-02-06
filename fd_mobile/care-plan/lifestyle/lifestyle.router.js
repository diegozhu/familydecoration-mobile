(function() {
  'use strict';

  angular
    .module('fdmobile.lifestyle')
    .config(lifestyleRoute);

  function lifestyleRoute($stateProvider) {
    $stateProvider
      .state({
        name: 'home.carePlan.lifestyle',
        url: '/lifestyle',
        cache: false,
        views: {
          'careplan-lifestyle': {
            templateUrl: 'care-plan/lifestyle/lifestyle.html',
            controller: 'LifeStyleController as vm'
          }
        }
      });
  }
})();
