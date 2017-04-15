(function() {
  'use strict';

  var app = angular.module('fdmobile.project');

  app.controller('ProjectController', function(
    $rootScope,
    $scope,
    projectService,
    planService,
    projects,
    $log,
    $fdPopup,
    $state,
    $fdToast,
    $filter,
    $ionicScrollDelegate,
    $timeout
  ) {
    var
      vm = this,
      loadProject = function(promise) {
        promise.then(function(res) {
          $log.log('plan module:' + projectService.events.updated);
          if (projectService.needLoadAll()) {
            var
              resData = $filter('unique')(res.data, 'captainName'),
              obj = {};
            angular.forEach(resData, function(d) {
              obj[d.captainName] = {
                captain: d.captain,
                projects: []
              };
            });
            angular.forEach(res.data, function(d) {
              obj[d.captainName]['projects'].push(d);
            });
            vm.captains = resData;
            vm.projects = obj;
          }
          else {
            vm.projects = res.data;
          }
        }, function(res) {
          $log.log(res.errMsg);
        });
      };

    $scope.searchName = '';

    $scope.toggleGroup = function(captain) {
      captain.show = !captain.show;
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 100);
    };

    $scope.isGroupShown = function(captain) {
      // we have to do this before switching item visibility statuses.
      $ionicScrollDelegate.resize();
      return captain.show;
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

    loadProject(projects.$promise);
  });
})();
