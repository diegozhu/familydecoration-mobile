/**
 ***************************** ForgotPassword Configuration *****************************
 *
 * Configure the route for the forgotpassword module.
 * The 3rd-party of angular-resource is used to provide route funcationality.
 * For example, config a forgotpassword state:
 * $stateProvider.state('forgotpassword', {
 *     url: '/forgotpassword',
 *     templateUrl: 'security/forgotpassword/forgotpassword.html',
 *     controller: 'ForgotPasswordController',
 *     controllerAs: 'ForgotPasswordCtrl'
 *   })
 *
 */
'use strict';

(function() {
  angular
    .module('fdmobile.security')
    .config(function($stateProvider) {

      // Define states, each state maps to a url and template url
      $stateProvider.state('firststep', {
        url: '/forgotpassword/firststep',
        templateUrl: 'security/forgot-password/check-verification-code.html',
        controller: 'CheckVerificationCodeController',
        controllerAs: 'CheckVerificationCodeCtrl'
      })
      .state('secondstep', {
        url: '/forgotpassword/secondstep',
        templateUrl: 'security/forgot-password/new-password.html',
        controller: 'NewPasswordController',
        controllerAs: 'NewPasswordCtrl'
      })
      .state('success', {
        url: '/forgotpassword/success',
        templateUrl: 'security/forgot-password/success.html',
        controller: 'SuccessController',
        controllerAs: 'SuccessCtrl'
      });
    });
})();
