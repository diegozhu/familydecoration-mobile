(function() {
  'use strict';

  var app = angular.module('fdmobile.plan');

  app.controller('PlanController', function(
    $rootScope,
    $scope,
    projectService,
    planService,
    projects,
    $log,
    $fdPopup,
    $state,
    $fdToast
  ) {
    var
      vm = this,
      loadProject = function(promise) {
        promise.then(function(res) {
          $log.log('plan module:' + projectService.events.updated);
          vm.projects = res.data;
        }, function(res) {
          $log.log(res.errMsg);
        });
      };

    angular.extend(vm, {
      doRefresh: function() {
        var promise = projectService.getAllRemote();
        loadProject(promise);
        return promise;
      },
      projects: []
    });

    vm.goto = function(state, project) {
      $state.go(state, {
        projectId: project.projectId,
        projectPeriod: project.period,
        projectName: project.projectName
      });
    };

    vm.createNewPlan = function(project) {
      var
        period = project.period.split(':'),
        startTime = period[0],
        endTime = period[1];
      $fdPopup.show({
        iconClass: 'ion-star',
        title: '询问',
        template: '确定要为"' + project.projectName + '"创建计划吗?',
        buttons: [
          {
            text: '确定',
            type: 'button-positive',
            onTap: function() {
              var promise = planService.createNewPlan({
                businessId: project.businessId,
                '@projectId': project.projectId,
                '@projectAddress': project.projectName,
                '@startTime': startTime,
                '@endTime': endTime
              });
              promise.then(function() {
                $fdToast.show({
                  text: '创建计划成功!',
                  cssClass: 'positive'
                });
                $state.go('home.plan.edit', {
                  projectId: project.projectId,
                  projectPeriod: project.period,
                  projectName: project.projectName
                });
              });
            }
          },
          {
            text: '取消',
            type: 'button-stable'
          }
        ]
      });
    };

    loadProject(projects.$promise);
  });
})();
