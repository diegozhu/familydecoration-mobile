(function() {
  'use strict';

  angular.module('fdmobile.gender').config(genderRouter);

  genderRouter.$inject = ['$stateProvider'];

  function genderRouter($stateProvider) {
    $stateProvider
      .state('configuregender', {
        url: '/profile/gender',
        params: {
          'user': ''
        },
        templateUrl: 'profile/gender/gender.html',
        controller: 'GenderController as vm',
        cache: false
      });
  }

})();
