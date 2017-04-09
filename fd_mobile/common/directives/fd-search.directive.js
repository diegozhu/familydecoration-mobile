(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('fdSearch', function() {
      return {
        restrct: 'E',
        replace: true,
        scope: {
          searchModel: '=',
          emptyText: '@'
        },
        template: '<input class="fd-search" ng-model="searchModel" placeHolder="{{emptyText}}" />'
      };
    });
})();

