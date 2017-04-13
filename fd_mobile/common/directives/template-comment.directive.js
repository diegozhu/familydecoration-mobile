(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('templateComment', templateComment);

  function templateComment() {
    return {
      restrict: 'E',
      compile: function(tElement) {
        tElement.remove();
      }
    };
  }
})();
