(function() {
  'use strict';

  angular
    .module('fdmobile.diaginfo')
    .config(diaginfo);

  diaginfo.$inject = ['$stateProvider'];

  function diaginfo($stateProvider) {
    $stateProvider
      .state('diaginfo', {
        url: '/profile/diaginfo',
        templateUrl: 'profile/diaginfo/diaginfo.html',
        controller: 'DiaginfoController as vm',
        params: {user: null}
      });
  }
})();
