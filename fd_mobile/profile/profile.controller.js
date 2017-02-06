(function() {
  'use strict';

  angular
    .module('fdmobile.profile')
    .controller('ProfileController', ProfileController);

  function ProfileController($rootScope, $scope, $state, $stateParams, $translate, profileService, profileDataService, authenticationService) {

    var vm = this,
      GenderMapping = {
        '0': 'FEMAILE',
        '1': 'MALE',
        '2': 'UNKNOW'
      };
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
      getmobileBaseInfo();
    }

    function getmobileBaseInfo() {
      profileService.getmobileBaseInfo().$promise.then(function(resource) {
        var up = resource.data;
        angular.extend(vm.user, up);
        if (up.birthDate) {
          vm.user.birthDay = new Date(up.birthDate);
        }
        vm.user.oid = up.oid;
        vm.user.gender = up.gender.code;
        vm.user.genderDisplay = $translate.instant(GenderMapping[up.gender.code] || 'UNKNOWN');
        getmobileDiseaseInfo();
      });
      if ($stateParams && $stateParams.action) {
        switch ($stateParams.action) {
          case 'setGender':
            vm.user.gender = $stateParams.value;
            vm.user.genderDisplay = $translate.instant(GenderMapping[$stateParams.value]);
            break;
          default:
            throw 'unknow action';
        }
      }
    }

    function getmobileDiseaseInfo() {
      profileService.getmobileDiseaseInfo({
        mobileOid: vm.user.oid
      }).$promise.then(function(res) {
        profileDataService.setmobileInfo(res.data);
        var dianosisArray = res.data.hospitalization.diagnosis;
        vm.dischargeSummary = res.data.dischargeSummary.admissionCondition;
        var diagnosisVal = [];
        angular.forEach(dianosisArray, function(item) {
          diagnosisVal.push(item.label);
        });
        vm.user.diagnosis = diagnosisVal.toString();
      });
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
