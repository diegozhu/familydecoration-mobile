(function() {
  'use strict';

  angular
    .module('fdmobile.forgotPassword')
    .factory('ForgotPasswordService', forgotPasswordService);

  forgotPasswordService.$inject = ['$resource', 'urlBuilder'];

  function forgotPasswordService($resource, urlBuilder) {

    return $resource(urlBuilder.build('security/verification-code/:cellphone'), {}, {
      verifyUserExist: {
        method: 'GET',
        params: {cellphone: '@cellphone'},
        url: urlBuilder.build('user/:cellphone')
      },
      getVerificationCodeByCellphone: {
        method: 'GET',
        params: {cellphone: '@cellphone'}
      },
      verifyCode: {
        method: 'POST',
        url: urlBuilder.build('security/verifycode')
      },
      findPassword: {
        method: 'POST',
        url: urlBuilder.build('user/findPassword')
      }
    });
  }
})();
