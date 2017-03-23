(function() {
  'use strict';

  angular.module('fdmobile.plan', [
    'fdmobile.plan.edit'
  ]);

  angular.module('fdmobile.plan').config(function($stateProvider) {
    $stateProvider.state('home.plan', {
      url: 'plan',
      views: {
        'tab-plan': {
          templateUrl: 'plan/plan.html',
          controller: 'PlanController as vm',
          resolve: {
            projects: function(projectService) {
              'ngInject';
              return projectService.getAll();
            }
          }
        }
      }
    });
  });
})();
