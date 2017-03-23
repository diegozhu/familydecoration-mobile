(function() {
  'use strict';

  angular.module('fdmobile.plan.edit', []);

  angular.module('fdmobile.plan.edit').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.plan.edit',
      url: '/plan/edit',
      views: {
        'tab-coach': {
          templateUrl: 'plan/edit/planedit.html',
          controller: 'PlanEditController as vm',
          params: {
            project: null
          },
          resolve: {
            project: function(){}
          }
        }
      }
    });
  });
})();
