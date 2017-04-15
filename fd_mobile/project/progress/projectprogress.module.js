(function() {
  'use strict';

  angular.module('fdmobile.project.progress', []);

  angular.module('fdmobile.project.progress').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.project.progress',
      url: '/project/:projectId/progress',
      params: {
        projectId: null,
        projectPeriod: null,
        projectName: null
      },
      views: {
        'tab-project@home': {
          templateUrl: 'project/eprogress/projectprogress.html',
          controller: 'ProjectProgressController as vm',
          resolve: {
            planItems: function(planService, $stateParams) {
              return planService.getPlanItemsByProjectId({
                projectId: $stateParams.projectId
              });
            },
            projectPeriod: function($stateParams) {
              return $stateParams.projectPeriod;
            }
          }
        }
      }
    });
  });
})();
