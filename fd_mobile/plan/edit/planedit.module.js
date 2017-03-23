(function() {
  'use strict';

  angular.module('fdmobile.plan.edit', []);

  angular.module('fdmobile.plan.edit').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.plan.edit',
      url: 'plan/:planId/edit',
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
<<<<<<< Updated upstream
            project: function() {}
=======
            projects: function() {
              'ngInject';
              console.log('plan edit resolve 1');
              return 1;
            }
>>>>>>> Stashed changes
          }
        }
      }
    });
  });
})();
