(function() {
  'use strict';

  var app = angular.module('fdmobile.plan');

  app.controller('PlanController', function(
    $rootScope,
    $scope,
    projectService,
    projects,
    $log,
    $fdPopup
  ) {
    var vm = this;

    angular.extend(vm, {
      doRefresh: projectService.getAllRemote,
      projects: projects
    });

    $rootScope.$on(projectService.events.updated, function(event, res) {
      $log.log(projectService.events.updated);
      $scope.$broadcast('scroll.refreshComplete');
      vm.projects = res.data;
    });

    vm.showTip = function(project) {
      var
        info = [],
        period = project.period.split(':');
      info.push(
        '工程名称: ' + project.projectName + '<br />',
        '项目经理: ' + project.captain + '<br />',
        '开始时间: ' + period[0] + '<br />',
        '结束时间: ' + period[1] + '<br />'
      );
      $fdPopup.show({
        iconClass: 'ion-star',
        title: project.name,
        template: info.join(''),
        buttons: [{
          text: 'yes',
          type: 'button-positive'
        }]
      });
    };
  });
})();
