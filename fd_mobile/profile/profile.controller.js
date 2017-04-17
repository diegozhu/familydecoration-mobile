(function() {
  'use strict';

  angular
    .module('fdmobile.profile')
    .controller('ProfileController', ProfileController);

  function ProfileController($rootScope, $scope, $state, $stateParams, $translate, profileService, profileDataService, authenticationService, $fdUser, $ionicModal) {

    var
      vm = this;
    vm.user = {
    };
    var polishUserInfo = function(obj) {
      angular.extend(vm.user, obj);
    };
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    angular.extend(vm.user, {
      userName: userInfo.name,
      userTitle: $fdUser.getTitle(userInfo.level)
    });
    init();

    function init() {
      var currentUserInfo = sessionStorage.getItem('currentUserInfo');
      if (currentUserInfo) {
        polishUserInfo(JSON.parse(currentUserInfo));
      }
      else {
        profileService.getCurrentUserInfo({
          name: userInfo.name
        }, function(res) {
          if (res.data.length > 0) {
            currentUserInfo = res.data[0];
            sessionStorage.setItem('currentUserInfo', JSON.stringify(currentUserInfo));
            localStorage.setItem('currentUserInfo', JSON.stringify(currentUserInfo));
            polishUserInfo(currentUserInfo);
          }
        });
      }
    }

    $scope.showImages = function() {
      $scope.showModal('profile/image-popover.html');
    };

    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    // Close the modal
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove();
    };

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
