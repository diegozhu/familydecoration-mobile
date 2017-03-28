(function() {
  'use strict';

  angular.module('fdmobile.plan.edit').controller('PlanEditController', function(
    planItems,
    projectPeriod,
    $log,
    $fdPopup,
    $scope,
    planService,
    planEditService,
    $filter,
    $fdToast,
    $stateParams
  ) {
    var vm = this;

    angular.extend($scope, {
      projectName: $stateParams.projectName,
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

    $scope.getDateFromStr = function(str) {
      var d = '';
      if (str && str.replace) {
        str = str.replace(/-/gi, '/');
        d = new Date(str);
      }
      if (d instanceof Date && isNaN(d.getTime())) {
        d = '';
      }
      return d;
    };

    vm.doRefresh = function() {
      var promise = planService.getPlanItemsByProjectId({
        projectId: $stateParams.projectId
      });
      promise.then(function(res) {
        vm.planItems = res.data;
      });
      return promise;
    };

    vm.showPlanSchedule = function(planItem) {
      var
        id = planItem.id,
        startTime = planItem.startTime,
        endTime = planItem.endTime,
        period = projectPeriod.split(':'),
        minDate = period[0],
        maxDate = period[1];
      startTime = $scope.getDateFromStr(startTime);
      endTime = $scope.getDateFromStr(endTime);
      minDate = $scope.getDateFromStr(minDate);
      maxDate = $scope.getDateFromStr(maxDate);
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
        title: '编辑',
        subTitle: '编辑计划条目时间',
        scope: angular.extend($scope, {
          id: id,
          planItem: planItem,
          startTime: startTime,
          endTime: endTime,
          minDate: minDate,
          maxDate: maxDate
        }),
        template: [
          '<div>开始时间:',
          '<fd-picker mode="date" is-required="" ng-model="startTime" range-min="minDate" range-max="maxDate" filter="yyyy/MM/dd">',
          '</div>',
          '<div>结束时间:',
          '<fd-picker mode="date" is-required="" ng-model="endTime" range-min="minDate" range-max="maxDate" filter="yyyy/MM/dd">',
          '</div>'
        ].join(''),
        buttons: [{
          text: '更新',
          type: 'button-positive',
          onTap: function(e) {
            var
              err,
              scope = this.scope,
              startTime = scope.startTime,
              endTime = scope.endTime,
              minDate = scope.minDate,
              maxDate = scope.maxDate;
            function isWithinPeriod(t, minDate, maxDate, type) {
              var err;
              if (t.getTime() < minDate.getTime() || t.getTime() > maxDate.getTime()) {
                err = type + '要在' + $filter('date')(minDate, 'yyyy-MM-dd') + '~' + $filter('date')(maxDate, 'yyyy-MM-dd') + '之间';
              }
              return err;
            }
            if (startTime) {
              err = isWithinPeriod(startTime, minDate, maxDate, '计划开始时间');
            }
            if (!err && endTime) {
              err = isWithinPeriod(endTime, minDate, maxDate, '计划结束时间');
            }
            if (!err && startTime && endTime) {
              err = startTime.getTime() > maxDate.getTime() ? '开始时间不能大于结束时间' : undefined;
            }
            if (!err && !startTime && !endTime) {
              err = undefined;
            }

            if (err) {
              $fdToast.show({
                text: err
              });
              e.preventDefault();
              return false;
            }
            startTime = $filter('date')(scope.startTime, 'yyyy-MM-dd');
            endTime = $filter('date')(scope.endTime, 'yyyy-MM-dd');
            var promise = planEditService.updatePlanItem({
              id: scope.id,
              '@time': [startTime, endTime].join('~')
            });

            promise.then(function(res) {
              if (res.status == 'successful') {
                scope.planItem.startTime = startTime;
                scope.planItem.endTime = endTime;
                $fdToast.show({
                  text: '更新成功!',
                  cssClass: 'positive'
                });
              }
            }, function(res) {
              $log.log(res.errMsg);
            });
          }
        }, {
          text: '取消',
          type: 'button-stable'
        }]
      });
    };
  });
})();
