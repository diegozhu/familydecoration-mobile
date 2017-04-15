(function() {
  'use strict';

  angular.module('fdmobile.project.progress', []);

  angular.module('fdmobile.project.progress').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.project.progress',
      url: '/:projectId/progress',
      params: {
        projectId: null,
        projectPeriod: null,
        projectName: null
      },
      views: {
        'tab-project@home': {
          templateUrl: 'project/progress/projectprogress.html',
          controller: 'ProjectProgressController as vm',
          resolve: {
            planItems: function(projectService, $stateParams) {
              return projectService.getProjectProgress({
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
