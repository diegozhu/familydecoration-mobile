(function() {
  'use strict';

  angular.module('fdmobile.project', []);

  angular.module('fdmobile.project').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.project',
      url: 'project',
      views: {
        'tab-project': {
          templateUrl: 'project/project.html',
          controller: 'ProjectController as vm',
          resolve: {
            projects: ['projectService', function(service) {
              return service.getAll();
            }]
          }
        }
      }
    });
  });
})();