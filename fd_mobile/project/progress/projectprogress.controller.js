(function() {
  'use strict';

  angular.module('fdmobile.project.progress').controller('ProjectProgressController', function(
    planItems,
    projectPeriod,
    projectService,
    $log,
    $fdPopup,
    $scope,
    planService,
    planEditService,
    $filter,
    $fdToast,
    $stateParams,
    ionicDatePicker,
    $ionicModal
  ) {
    var vm = this;

    $ionicModal.fromTemplateUrl('project/progress/progressdetail.modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });

    angular.extend($scope, {
      projectName: $stateParams.projectName
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
      return projectService.getProjectProgress({
        projectId: $stateParams.projectId
      }).then(function(res) {
        vm.planItems = res.data;
      });
      //return promise;
    };

    vm.addSupervisorComment = function(){
      $fdPopup.show({
        iconClass: 'ion-star',
        title: '询问',
        template: '//TODO',
        buttons: [
          {
            text: '确定',
            type: 'button-positive',
            onTap: function() {
            }
          },
          {
            text: '取消',
            type: 'button-stable'
          }
        ]
      });
    }
    vm.addPracticalProgress = function(){
      $fdPopup.show({
        iconClass: 'ion-star',
        title: '询问',
        template: '//TODO',
        buttons: [
          {
            text: '确定',
            type: 'button-positive',
            onTap: function() {
            }
          },
          {
            text: '取消',
            type: 'button-dark'
          }
        ]
      });
    };

    vm.showProgressDetail = function(planItem) {
      vm.planItem = planItem;
      vm.modal.show();
    };
  });

})();
