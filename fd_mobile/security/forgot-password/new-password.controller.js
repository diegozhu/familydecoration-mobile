/**
 ***************************** NewPasswordController ****************************
 *
 * The NewPasswordController is used to reset password after forgot passwords.
 */
'use strict';

(function() {
  angular.module('fdmobile.forgotPassword').controller('NewPasswordController', NewPasswordController);

  // Injecting necessary dependentencies in this way for improve optimization
  NewPasswordController.$inject = ['$state', 'ForgotPasswordService', 'PasswordModelService', '$translate',
    '$fdPopup'];

  function NewPasswordController($state, ForgotPasswordService, PasswordModelService, $translate,
    $fdPopup) {
    // Define variable with key word var
    var vm = this;

    vm.goNext = goNext;
    vm.goBack = goBack;

    function goNext() {
      vm.cellphoneNo = PasswordModelService.getPasswordModel().cellphone;
      if ( !vm.newPassword ) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_FORGOTPASSWORD_NEWPASSWORDISNULL')
        });
        return;
      }
      if ( vm.newPassword && !vm.confirmPassword ) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_FORGOTPASSWORD_CONFIRMPASSWORDISNULL')
        });
        return;
      }
      if ( vm.newPassword && vm.confirmPassword && vm.newPassword !== vm.confirmPassword) {
        $fdPopup.alert({
          template: $translate.instant('SECURITY_FORGOTPASSWORD_PASSWORDNOTMATCH')
        });
        return;
      }
      var findPasswordModel = {
        username: vm.cellphoneNo,
        password: vm.newPassword,
        confirmedPassword: vm.confirmPassword,
        token: PasswordModelService.getPasswordModel().token,
        code: PasswordModelService.getPasswordModel().verificationCode,
        cellphone: vm.cellphoneNo
      };
      ForgotPasswordService.findPassword(findPasswordModel, function(response) {
        if (response.status === 200) {
          $state.go('success');
        }
      });
    }

    function goBack() {
      $state.go('firststep');
    }

  }

})();
