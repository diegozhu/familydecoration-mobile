(function() {
  'use strict';

  var app = angular.module('fdmobile.plan');

  app.controller('PlanController', function(
    $rootScope,
    $scope,
    projectService,
    projects,
    $log,
    $fdPopup,
    $state
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
        projectPeriod: project.period
      });
    };

    vm.createNewPlan = function(project) {
      $fdPopup.show({
        iconClass: 'ion-star',
        title: '询问',
        template: '确定要为"' + project.projectName + '"创建计划吗?',
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
    };

    loadProject(projects.$promise);
  });
})();
