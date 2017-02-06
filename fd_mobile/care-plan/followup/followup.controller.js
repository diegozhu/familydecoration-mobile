(function() {
  'use strict';

  angular
    .module('fdmobile.followup')
    .controller('FollowupController', FollowupController);

  function FollowupController($scope, followupService, $ionicModal) {
    var vm = this;

    angular.extend(vm, {
      openModal: openModal,
      closeModal: closeModal
    });

    init();

    function init() {
      vm.agendaView = false;

      $ionicModal.fromTemplateUrl('care-plan/followup/modal/followup.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(res) {
        vm.modal = res;
      });

      followupService.get().$promise.then(function(response) {
        var data = response.data.activities[0].followupOrder.currentFollowupTemplateModel;

        vm.dischargeDate = data.dischargeDate;
        vm.followups = data.nodes;
      });
    }

    function openModal(index) {
      vm.followup = vm.followups[index];
      vm.modal.show();
    }

    function closeModal() {
      vm.modal.hide();
    }
  }
})();
