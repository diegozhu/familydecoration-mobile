(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('mobile', mobile)
    .directive('password', password);

  function mobile(CONSTANT) {
    return {
      require: 'ngModel',
      link: function($scope, el, attrs, ngModel) {
        ngModel.$validators.mobile = function(val) {
          return CONSTANT.MOBILE_REGEXP.test(val);
        };
      }
    };
  }

  function password(CONSTANT) {
    return {
      require: 'ngModel',
      link: function($scope, el, attrs, ngModel) {
        ngModel.$validators.password = function(val) {
          return CONSTANT.PASSWORD_REGEXP.test(val);
        };
      }
    };
  }
})();
