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

    loadProject(projects.$promise);

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
