(function() {
  'use strict';

  angular.module('fdmobile.plan.edit', []);

  angular.module('fdmobile.plan.edit').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.plan.edit',
      url: '/:planId/edit',
      onEnter: function() {
        console.log('onEnter plan edit outter');
      },
      params: {
        planId: null
      },
      views: {
        'tab-plan@home': {
          templateUrl: 'plan/edit/planedit.html',
          controller: 'PlanEditController as vm',
          resolve: {
            projects: function() {
              'ngInject';
              return 1;
            }
          }
        }
      }
    });
  });
})();
