(function() {
  'use strict';

  angular
    .module('fdmobile.reference.demos')
    .config(demosRouter);

  function demosRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.reference.demos',
        url: '/demos',
        views: {
          'reference-demos': {
            templateUrl: 'reference/demos/demos.html',
            controller: 'DemosController as vm'
          }
        }
      });
  }
})();
