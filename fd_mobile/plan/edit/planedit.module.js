(function() {
  'use strict';

  angular.module('fdmobile.plan.edit', []);

  angular.module('fdmobile.plan.edit').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.plan.edit',
      url: '/edit/:projectId',
      onEnter: function() {
        console.log('onEnter plan edit outter');
      },
      params: {
        projectId: null
      },
      views: {
        'tab-plan@home': {
          templateUrl: 'plan/edit/planedit.html',
          controller: 'PlanEditController as vm',
          resolve: {
            planItems: function(planService, $stateParams) {
              return planService.getPlanItemsByProjectId({
                projectId: $stateParams.projectId
              });
            }
          }
        }
      }
    });
  });
})();
