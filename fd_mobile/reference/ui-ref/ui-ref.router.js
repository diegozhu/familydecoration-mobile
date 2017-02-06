(function() {
  'use strict';

  angular
    .module('fdmobile.reference.uiRef')
    .config(uiRefRouter);

  function uiRefRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.reference.uiRef',
        url: '/uiref',
        views: {
          'reference-ui-ref': {
            templateUrl: 'reference/ui-ref/ui-ref.html'
          }
        }
      });
  }
})();
