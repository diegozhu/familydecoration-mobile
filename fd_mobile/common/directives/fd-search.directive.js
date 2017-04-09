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
        template: [
          '<div class="fd-search">',
          '<input ng-model="searchModel" placeHolder="{{emptyText}}" />',
          '<div class="remove" ng-click="remove()">x</div>',
          '</div>'
        ].join(''),
        link: function(scope) {
          scope.remove = function() {
            scope.searchModel = '';
          };
        }
      };
    });
})();

