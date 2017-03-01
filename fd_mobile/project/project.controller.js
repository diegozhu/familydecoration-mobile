(function() {
  'use strict';

  angular.module('fdmobile.project').controller('ProjectController', function(
    $rootScope,
    $templateCache,
    CONSTANT,
    $scope,
    $state,
    $ionicModal,
    $fdPopup,
    $translate,
    projectService,
    projects,
    $log
  ) {

    var vm = this;

    angular.extend(vm, {
      projects: projects,
      doRefresh: projectService.getAllRemote,
      complianceScore: {score: 0}
    });

    $rootScope.$on(projectService.events.updating, function() {
      $log.log(projectService.events.updating);
      vm.projects = [];
    });

    $rootScope.$on(projectService.events.updated, function(event, response) {
      $log.log(projectService.events.updated);
      vm.projects = response.data;
      $scope.$broadcast('scroll.refreshComplete');
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
