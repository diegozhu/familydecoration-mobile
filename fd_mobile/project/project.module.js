(function() {
  'use strict';

  angular.module('fdmobile.project', [
    'fdmobile.project.progress'
  ]);
  angular.module('fdmobile.project').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.project',
      url: 'project',
      views: {
        'tab-project': {
          templateUrl: 'project/project.html',
          controller: 'ProjectController as vm',
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
