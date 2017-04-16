(function() {
  'use strict';

  angular
    .module('fdmobile')
    .constant('backButtonPressed', false)
    .run(backButtonAction);

  function backButtonAction($timeout, $ionicPlatform, $state, $ionicHistory, backButtonPressed) {
    $ionicPlatform.registerBackButtonAction(function() {
      var currentState = $state.current.name;

      if (currentState === 'home.main' || currentState === 'login') {
        if (backButtonPressed) {
          ionic.Platform.exitApp();
        } else {
          backButtonPressed = true;

          $timeout(function() {
            backButtonPressed = false;
          }, 2000);
        }
      } else {
        if ($ionicHistory.backView()) {
          $ionicHistory.goBack();
        } else {
          $state.go('home.main');
        }
      }
    }, 101);
  }
})();
