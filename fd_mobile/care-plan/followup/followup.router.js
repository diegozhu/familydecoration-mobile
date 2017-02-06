(function() {
  'use strict';

  angular
    .module('fdmobile.followup')
    .config(followupRouter);

  function followupRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.carePlan.followup',
        url: '/followup',
        cache: false,
        views: {
          'careplan-followup': {
            templateUrl: 'care-plan/followup/followup.html',
            controller: 'FollowupController as vm'
          }
        }
      });
  }
})();
