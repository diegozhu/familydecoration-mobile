(function() {
  'use strict';

  angular.module('fdmobile.plan.edit').controller('PlanEditController', function(planItems, $log, $fdPopup, $scope) {
    var vm = this;

    angular.extend($scope, {
      date: new Date('2016/10/1'),
      minDate: new Date('2016/10/1'),
      maxDate: new Date('2016/10/7'),
      time: new Date(new Date().setHours(10, 10)),
      minTime: new Date().setHours(8),
      maxTime: new Date().setHours(12)
    });

    if (planItems.data) {
      vm.planItems = planItems.data;
    }
    else {
      planItems.then(function(res) {
        vm.planItems = res.data;
      }, function(res) {
        $log.log(res.errMsg);
      });
    }

    vm.showPlanSchedule = function(planItem) {
      $log.log(planItem);
      $fdPopup.show({
        /**
         * title: '', // The title of the popup.
         * iconClass: '', // The custom CSS class name
         * subTitle: '', // The sub-title of the popup.
         * template: '', // The html template to place in the popup body.
         * templateUrl: '', // The URL of an html template to place in the popup body.
         * scope: null, // A scope to link to the popup content.
         * buttons: [{ // Buttons to place in the popup footer.
         *   text: 'Cancel',
         *   type: 'button-default',
         *   onTap: function(e) {
         *     e.preventDefault(); // this will stop the popup from closing when tapped.
         *   }
         * }, {
         *   text: 'OK',
         *   type: 'button-positive',
         *   onTap: function(e) {
         *     return scope.data.response; // Returning a value will cause the promise to resolve with the given value.
         *   }
         * }]
        */
        iconClass: 'ion-star',
        title: 'Popup',
        subTitle: 'This is a popup',
        scope: $scope,
        template: [
          '开始时间:',
          '<fd-picker mode="date" is-required="true" ng-model="date" range-min="minDate" range-max="maxDate" filter="yyyy/MM/dd">',
          '结束时间',
          '<fd-picker mode="date" is-required="true" ng-model="date" range-min="minDate" range-max="maxDate" filter="yyyy/MM/dd">'
        ].join(''),
        buttons: [{
          text: 'OK',
          type: 'button-positive'
        }, {
          text: 'Cancel',
          type: 'button-stable'
        }]
      });
    };
  });
})();
