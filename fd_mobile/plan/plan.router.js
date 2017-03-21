(function() {
  'use strict';

  var app = angular.module('fdmobile.plan');

  app.config(function($stateProvider) {
    $stateProvider.state('home.plan', {
      url: 'plan',
      views: {
        'tab-plan': {
          templateUrl: 'plan/plan.html'
        }
      }
    });
  });
})();
