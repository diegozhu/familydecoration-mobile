(function() {
  'use strict';

  angular
    .module('fdmobile.main')
    .controller('mainController', mainController);

  function mainController($templateCache, CONSTANT, $scope, $state, $ionicModal, $fdPopup, $translate, messageResource, messages, $log) {

    var vm = this;
    angular.extend(vm, {
      messages: messages,
      doRefresh: messageResource.getAllRemote
    });

    // $scope.$on(taskService.events.updating, function() {
    //   $log.log(taskService.events.updating);
    //   vm.tasks = [];
    //   vm.complianceScore.score = 0;
    // });

    // $scope.$on(taskService.events.updated, function(event, tasks) {
    //   $log.log(taskService.events.updated);
    //   vm.tasks = tasks;
    //   vm.scorePanelInit();
    // });

    $log.log('this is main');

    vm.showTip = function(message) {
      $fdPopup.show({
        iconClass: 'ion-star',
        title: message.title,
        template: message.content,
        buttons: [{
          text: 'yes',
          type: 'button-positive'
        }]
      });
    };


    // vm.openComplianceScoreModal = function() {
    //   var modalUrl = 'main/modal/compliance-score.modal.html';

    //   $ionicModal.fromTemplateUrl(modalUrl, {
    //     scope: $scope,
    //     animation: 'slide-in-up'
    //   }).then(function(modal) {
    //     vm.complianceScoreModal = modal;
    //     modal.show();
    //   });
    // };

    // vm.closeComplianceScoreModal = function() {
    //   vm.complianceScoreModal.remove();
    // };

    // vm.scorePanelInit();
  }
})();
