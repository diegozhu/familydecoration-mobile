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
      $fdPopup.show({
        iconClass: 'ion-star',
        title: project.name,
        template: JSON.stringify(project),
        buttons: [{
          text: 'yes',
          type: 'button-positive'
        }]
      });
    };
  });
})();
