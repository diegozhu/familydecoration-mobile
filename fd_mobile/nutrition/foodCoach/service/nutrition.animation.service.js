/**
 ***************************** BMIService *****************************
 *
 * This service is for save weight and height.
 *
 */
'use strict';

(function() {
  angular
    .module('fdmobile.nutrition')
    .factory('nutritionPopupService', nutritionPopupService);

  nutritionPopupService.$inject = ['$translate', '$fdPopup', '$ionicLoading'];

  function nutritionPopupService($translate, $fdPopup, $ionicLoading) {
    var service = {
      showTip: showTip,
      showToast: showToast
    };
    return service;

    function showTip(title, content, btn) {
      $fdPopup.show({
        iconClass: 'ion-star',
        title: $translate.instant(title),
        template: content,
        buttons: [{
          text: $translate.instant(btn),
          type: 'button-positive'
        }]
      });
    }

    function showToast(tipMessage) {
      $ionicLoading.show({
        template: '<div class="nutrition-loading-icon"><i class="icon ion-android-done"></i></div>' + tipMessage,
        duration: 800
      });
    }
  }
})();
