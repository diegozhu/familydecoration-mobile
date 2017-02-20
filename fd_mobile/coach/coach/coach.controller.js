(function() {
  'use strict';

  angular
    .module('fdmobile.coach')
    .controller('CoachController', CoachController);

  function CoachController($templateCache, CONSTANT, $scope, $state, $ionicModal, $fdPopup, $translate, taskService, tasks, $log) {

    var vm = this;

    angular.extend(vm, {
      doTask: taskService.doTasks,
      tasks: tasks,
      doRefresh: taskService.getAllRemote,
      complianceScore: {score: 0}
    });

    $scope.$on(taskService.events.updating, function() {
      $log.log(taskService.events.updating);
      vm.tasks = [];
      vm.complianceScore.score = 0;
    });

    $scope.$on(taskService.events.updated, function(event, tasks) {
      $log.log(taskService.events.updated);
      vm.tasks = tasks;
      vm.scorePanelInit();
    });

    vm.showTip = function(task) {
      $fdPopup.show({
        iconClass: 'ion-star',
        title: task.name,
        template: 'todo',
        buttons: [{
          text: 'yes',
          type: 'button-positive'
        }]
      });
    };

    vm.scorePanelInit = function() {
      var completed = 0;
      angular.forEach(vm.tasks, function(task) {
        completed += task.completed ? 1 : 0;
      });
      var modal = {
        score: parseInt(completed / vm.tasks.length * 20),
        dogStatus: 'stable',
        statusTitle: $translate.instant('COACH_COMPLIANCE_SCORE_STABLE_TITLE'),
        statusSubtitle: $translate.instant('COACH_COMPLIANCE_SCORE_STABLE_SUBTITLE')
      };

      if (modal.score > 20) {
        modal.dogStatus = 'up';
        modal.statusTitle = $translate.instant('COACH_COMPLIANCE_SCORE_UP_TITLE');
        modal.statusSubtitle = $translate.instant('COACH_COMPLIANCE_SCORE_UP_SUBTITLE');
      } else if (modal.score < 10) {
        modal.dogStatus = 'down';
        modal.statusTitle = $translate.instant('COACH_COMPLIANCE_SCORE_DOWN_TITLE');
        modal.statusSubtitle = $translate.instant('COACH_COMPLIANCE_SCORE_DOWN_SUBTITLE');
      }
      vm.complianceScore = modal;
    };

    vm.openComplianceScoreModal = function() {
      var modalUrl = 'coach/modal/compliance-score.modal.html';

      $ionicModal.fromTemplateUrl(modalUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.complianceScoreModal = modal;
        modal.show();
      });
    };

    vm.closeComplianceScoreModal = function() {
      vm.complianceScoreModal.remove();
    };

    vm.scorePanelInit();
  }
})();
