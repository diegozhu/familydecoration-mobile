(function() {
  'use strict';

  angular
    .module('fdmobile.forgotPassword')
    .factory('PasswordModelService', passwordModelService);

  function passwordModelService() {
    var passwordModel = {
      'cellphone': '',
      'token': '',
      'verificationCode': ''
    };

    return {
      getPasswordModel: function() {
        return passwordModel;
      }
    };
  }
})();
