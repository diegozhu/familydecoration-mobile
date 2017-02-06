(function() {
  'use strict';

  angular
    .module('fdmobile.configname')
    .config(confignameRouter);

  confignameRouter.$inject = ['$stateProvider'];

  function confignameRouter($stateProvider) {
    $stateProvider
      .state('configurename', {
        url: '/profile/configname',
        templateUrl: 'profile/configname/configname.html',
        controller: 'ConfignameController as vm'
      });
  }
})();
