(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('fdPicker', fdPicker);

  function fdPicker($fdToast, $filter) {
    return {
      replace: true,
      scope: {
        ngModel: '=',
        rangeMin: '=',
        rangeMax: '=',
        mode: '@',
        filter: '@'
      },
      template:
        '<div class="fd-picker">' +
          '<span>{{ngModel | date: filter}}</span>' +
          '<i class="font-large icon {{iconClass}}"></i>' +
          '<input ng-model="ngModel" type="{{mode}}" ng-change="validator()">' +
        '</div>',
      link: function($scope, el, attrs) {
        $scope.iconClass = attrs.mode === 'date' ? 'icon-fd-calendar' : 'icon-fd-schedule';

        $scope.validator = function() {
          var val = $scope.ngModel,
            min = $scope.rangeMin,
            max = $scope.rangeMax;

          if (val) {
            if (max && val > max) {
              $fdToast.show({
                text: '请选择一个' + $filter('date')(max, $scope.filter) + '之前的时间'
              });
              el.addClass('error');
              $scope.$emit('validator', false);
              return;
            }

            if (min && val < min) {
              $fdToast.show({
                text: '请选择一个' + $filter('date')(min, $scope.filter) + '之后的时间'
              });
              el.addClass('error');
              $scope.$emit('validator', false);
              return;
            }
          } else {
            if (attrs.isRequired) {
              $fdToast.show({
                text: '此项为必填'
              });
              el.addClass('error');
              $scope.$emit('validator', false);
              return;
            }
          }

          el.removeClass('error');
          $scope.$emit('validator', true);
        };
      }
    };
  }
})();
