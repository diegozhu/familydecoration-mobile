/**
 ***************************** CheckVerificationCodeController ****************************
 *
 * The CheckVerificationCodeController is used to reset password after forgot passwords.
 */
'use strict';

(function() {
  angular
    .module('fdmobile.forgotPassword')
    .controller('CheckVerificationCodeController', CheckVerificationCodeController);

  // Injecting necessary dependentencies in this way for improve optimization
  CheckVerificationCodeController.$inject = ['$state', '$stateParams', 'ForgotPasswordService', 'PasswordModelService', '$translate',
    '$fdPopup'];

  function CheckVerificationCodeController($state, $stateParams, ForgotPasswordService, PasswordModelService, $translate,
    $fdPopup) {
    // Define variable with key word var
    var vm = this;

    vm.verificationMode = '';
    vm.goBack = goBack;
    vm.goNext = goNext;
    vm.getVerificationCode = getVerificationCode;

    //return to login page
    function goBack() {
      $state.go('login');
    }

    // page jump to next
    function goNext() {
      //change passwordModel cellphone no
      PasswordModelService.getPasswordModel().cellphone = vm.verificationMode.cellphone;
      if (!vm.verificationMode.cellphone) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_FORGOTPASSWORD_CELLPHONENOTNULL')
        });
        return;
      }
      //Verify the code cannot be empty.
      if (!vm.verificationMode.code) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_FORGOTPASSWORD_VERIFICATIONCODEISNULL')
        });
        return;
      }

      ForgotPasswordService.verifyCode(vm.verificationMode).$promise.then(verificationComplete).catch(verificationCodeWrong);

      function verificationComplete() {
        vm.verificationMode.code = '';
        $state.go('secondstep');
      }

      function verificationCodeWrong(error) {
        $fdPopup.alert({
          template: $translate.instant(error.data.error.message)
        });
        //error.data.error.message
      }
    }

    // send verification code depend on the phone number
    function getVerificationCode() {
      //Verify the cellphone cannot be empty.
      if (!vm.verificationMode.cellphone) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_FORGOTPASSWORD_CELLPHONENOTNULL')
        });
        return;
      }
      if (vm.verificationMode.cellphone.length !== 11) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_LOGIN_CELLPHONENOTVALID')
        });
        return;
      }
      if (!(/^1[3|4|5|7|8]\d{9}$/.test(vm.verificationMode.cellphone))) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_LOGIN_CELLPHONENOTVALID')
        });
        return;
      }
      //Verify whether the user is exist.
      ForgotPasswordService.verifyUserExist({cellphone: vm.verificationMode.cellphone}, function(response) {
        //TODO
        if (response.status === 200) {
          ForgotPasswordService.getVerificationCodeByCellphone({cellphone: vm.verificationMode.cellphone})
          .$promise
          .then(generateVCode)
          .catch(generateVCodeWrong);
        } else {
          //TODO
          $fdPopup.alert({
            template: $translate.instant('SECURITY_FORGOTPASSWORD_USERNAMENOTEXIST')
          });
        }
      });
    }

    function generateVCode(codeResult) {
      vm.verificationMode.code = codeResult.data.code;
      vm.verificationMode.token = codeResult.data.token;
      PasswordModelService.getPasswordModel().token = codeResult.data.token;
      PasswordModelService.getPasswordModel().verificationCode = codeResult.data.code;
    }

    function generateVCodeWrong(error) {
      $fdPopup.alert({
        template: $translate.instant(error.data.error.message)
      });
    }

  }

})();
