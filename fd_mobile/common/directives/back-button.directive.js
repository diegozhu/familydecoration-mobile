(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('backButton', backButton);

  backButton.$inject = ['$ionicHistory', '$state'];

  function backButton($ionicHistory, $state) {
    return {
      replace: true,
      scope: {
        backAction: '&'
      },
      link: function(scope, elem, attrs) {
        elem.on('click', function() {
          if (attrs.backAction) {
            scope.backAction();
          } else {
            if ($ionicHistory.backView()) {
              $ionicHistory.goBack();
            } else {
              $state.go('home.main');
            }
          }
        });
      },
      template: '<button class="button button-icon icon ion-ios-arrow-back font-white"></button>'
    };
  }
})();
