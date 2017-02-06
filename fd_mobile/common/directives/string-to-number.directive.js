(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('stringToNumber', stringToNumber);

  function stringToNumber() {
    return {
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return '' + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value);
        });
      }
    };
  }
})();
