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
        views: {
          'tab-coach': {
            templateUrl: 'coach/coach/coach.html',
            controller: 'CoachController as vm',
            resolve: {
              tasks: ['taskService', function(taskService) {
                //if you need refresh all the time, invoke
                //return taskService.getAllRemote();
                return taskService.getAll();
              }]
            }
          }
        }
      });
  }
})();
