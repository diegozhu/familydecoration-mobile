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

    var
      vm = this,
      loadProject = function(promise) {
        promise.then(function(res) {
          $log.log('project module:' + projectService.events.updated);
          vm.projects = res.data;
        }, function(res) {
          $log.log(res.errMsg);
        });
      };

    angular.extend(vm, {
      projects: [],
      doRefresh: function() {
        var promise = projectService.getAllRemote();
        loadProject(promise);
        return promise;
      },
      complianceScore: {score: 0}
    });

    loadProject(projects.$promise);

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
