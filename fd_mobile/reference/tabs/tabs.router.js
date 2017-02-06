(function() {
  'use strict';

  angular
    .module('fdmobile.reference')
    .config(referenceRouter);

  function referenceRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.reference',
        url: 'reference',
        abstract: true,
        views: {
          'tab-reference': {
            templateUrl: 'reference/tabs/tabs.html'
          }
        }
      });
  }
})();
