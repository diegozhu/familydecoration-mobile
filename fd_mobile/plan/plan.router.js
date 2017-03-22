(function() {
  'use strict';

  var app = angular.module('fdmobile.plan');

  app.config(function($stateProvider) {
    $stateProvider.state('home.plan', {
      url: 'plan',
      cache: false,
      views: {
        'tab-plan': {
          templateUrl: 'plan/plan.html',
          controller: 'PlanController as vm',
          resolve: {
            projects: function(projectService) {
              return projectService.getAll();
            }
          }
        }
      }
    });
  });
})();
