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
    $fdToast,
    $filter,
    $ionicScrollDelegate,
    $timeout,
    urlBuilder,
    $cordovaInAppBrowser
  ) {
    var
      vm = this,
      loadProject;

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

    $scope.preview = function(project) {
      var promise = planService.getPlanByProjectId({
        projectId: project.projectId
      });
      promise.then(function(res) {
        if (res.data.length > 0) {
          var planId = res.data[0].id;
          var pdfUrl = urlBuilder.build('fpdf/plan.php?id=' + planId + '&page=A3');
          window.cordova.InAppBrowser.open(pdfUrl, '_system', 'location=yes, toolbar=yes, closebuttoncaption=关闭');
        }
        else {
          $fdToast.show({
            text: '没有可预览的计划'
          });
        }
      }, function(res) {
        $fdToast.show({
          text: res.errMsg
        });
      });
    };

    $scope.isSearchBarEmpty = function() {
      return vm.searchName === '';
    };

    $scope.projectMatched = function(project) {
      return project.projectName.indexOf(vm.searchName) !== -1;
    };

    angular.extend(vm, {
      doRefresh: function() {
        var promise = projectService.getAllRemote();
        loadProject(promise);
        return promise;
      },
      projects: []
    });

    vm.searchName = '';

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

    // for cordova browser config
    $rootScope.$on('$cordovaInAppBrowser:loadstart', function() {

    });

    $rootScope.$on('$cordovaInAppBrowser:loadstop', function() {
      // insert CSS via code / file
      $cordovaInAppBrowser.insertCSS({
        code: 'body {background-color:blue;}'
      });

      // insert Javascript via code / file
      // $cordovaInAppBrowser.executeScript({
      //   file: 'script.js'
      // });
    });

    $rootScope.$on('$cordovaInAppBrowser:loaderror', function() {

    });

    $rootScope.$on('$cordovaInAppBrowser:exit', function() {

    });

    // Clean up the modal view.
    $scope.$on('$destroy', function() {
    });
  });
})();
