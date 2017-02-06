(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('dictService', dictService)
    .directive('fdSelect', fdSelect);

  function dictService($resource, urlBuilder) {
    return $resource(urlBuilder.build('dictionary/:groupname'));
  }

  function fdSelect($ionicActionSheet, dictService) {
    return {
      replace: true,
      scope: {
        ngModel: '='
      },
      link: function($scope, el, attrs) {
        $scope.label = attrs.sheetLabel;

        el.on('click', function() {
          var ss = attrs.sheetSource,
            raw = localStorage.getItem(ss),
            src;

          if (raw) {
            src = JSON.parse(raw);
            setSheet(src);
          } else {
            dictService.get({groupname: ss}).$promise.then(function(response) {
              src = response.data;
              setSheet(src);
              localStorage.setItem(ss, JSON.stringify(src));
            });
          }
        });

        function setSheet(src) {
          var btns = [];

          for (var i = 0; i < src.length; i++) {
            btns.push({text: src[i].label});
          }

          $ionicActionSheet.show({
            buttons: btns,
            titleText: '请选择',
            cancelText: '取消',
            buttonClicked: function(index) {
              $scope.label = btns[index].text;
              $scope.ngModel = src[index].code;
              return true;
            }
          });
        }
      },
      template: '<div class="fd-select">' +
        '<span>{{label}}</span>' +
        '<span class="right-arrow icon ion-chevron-right"></span>' +
      '</div>'
    };
  }
})();
