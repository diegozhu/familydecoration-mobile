(function() {
  'use strict';

  angular
    .module('fdmobile.coach')
    .config(coachRouter);

  function coachRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.coach',
        url: 'coach',
        cache: false,
        views: {
          'tab-coach': {
            templateUrl: 'coach/coach/coach.html',
            controller: 'CoachController as vm'
          }
        }
      });
  }
})();
