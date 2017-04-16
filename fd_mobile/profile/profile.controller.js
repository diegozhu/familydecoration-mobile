(function() {
  'use strict';

  angular
    .module('fdmobile.profile')
    .controller('ProfileController', ProfileController);

  function ProfileController($rootScope, $scope, $state, $stateParams, $translate, profileService, profileDataService, authenticationService) {

    var vm = this;
    vm.user = {
      oid: '',
      firstName: '',
      middleName: '',
      lastName: '',
      nickName: '',
      birthDay: '',
      gender: '',
      contact: '',
      genderDisplay: '',
      dianosis: ''
    };
    init();

    function init() {
    }

    vm.goto = function($s) {
      $state.go($s, {
        user: vm.user
      });
    };
    vm.logout = function() {
      authenticationService.logout();
      localStorage.clear();
      $state.go('login');
    };
  }
})();
