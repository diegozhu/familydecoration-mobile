(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('fdProjectItem', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'plan/directive/fd-project-item.html',
        scope: true,
        link: function() {
        }
      };
    });
})();
