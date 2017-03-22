(function() {
  'use strict';

  var app = angular.module('fdmobile.planedit');

  app.config(planeditRouter);

  planeditRouter.$inject = ['$stateProvider'];

  function planeditRouter($stateProvider) {
    $stateProvider.state('home.planedit', {
      url: 'planedit',
      templateUrl: 'plan/edit/planedit.html',
      controller: 'PlanEditController as vm',
      params: {
        project: null
      },
      resolve: {
        project: function() {
        }
      }
    });
  }
})();
