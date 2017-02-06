(function() {
  'use strict';

  angular
    .module('fdmobile.reference.utilRef')
    .config(utilRefRouter);

  function utilRefRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.reference.utilRef',
        url: '/utilref',
        views: {
          'reference-util-ref': {
            templateUrl: 'reference/util-ref/util-ref.html',
            controller: 'UtilRefController as vm'
          }
        }
      });
  }
})();
