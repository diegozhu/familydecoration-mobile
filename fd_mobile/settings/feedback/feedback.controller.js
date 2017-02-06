(function() {
  'use strict';
  angular.module('fdmobile.feedback').controller('FeedbackController', FeedbackController);

  FeedbackController.$inject = ['$scope', '$ionicHistory', '$fdToast', '$translate', 'settingsService'];

  function FeedbackController($scope, $ionicHistory, $fdToast, $translate, settingsService) {
    var vm = this;
    vm.feedback = {
      subject: '',
      author: '',
      content: ''
    };
    vm.submitting = false;
    //save feedback
    vm.post = function() {
      //validation
      var errorMsg = '';
      if (vm.feedback.content === '') {
        errorMsg = $translate.instant('CONTENT_EMPTY');
      }
      if (vm.feedback.author === '') {
        errorMsg = $translate.instant('AUTHOR_EMPTY');
      }
      if (vm.feedback.subject === '') {
        errorMsg = $translate.instant('SUBJECT_EMPTY');
      }
      if (errorMsg !== '') {
        $fdToast.show({
          timeout: 1000,
          dismissOnClick: false,
          dismissOnTimeout: true,
          text: errorMsg
        });
        return false;
      }
      //save feedback
      vm.submitting = true;
      settingsService.saveFeedback(vm.feedback).$promise.then(function() {
        //clear form
        vm.feedback = {
          subject: '',
          author: '',
          content: ''
        };
        //show ok
        $fdToast.show({
          timeout: 1000,
          dismissOnClick: false,
          dismissOnTimeout: true,
          cssClass: 'settings-feedback-ok',
          text: $translate.instant('SUBBMIT_OK')
        });
        //go back to last view
        setTimeout(function() {
          $ionicHistory.goBack();
        }, 1000);
      }).finally(function() {
        vm.submitting = false;
        $scope.$digest();
      });
    };
  }
})();
