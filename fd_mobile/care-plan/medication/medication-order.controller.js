(function() {
  'use strict';

  angular
    .module('fdmobile.medication')
    .controller('MedicationOrderController', MedicationOrderController);

  function MedicationOrderController($ionicPlatform, MedicationCarePlanService, dictService, $translate, $fdPopup, CONSTANT, $state, $scope, $ionicModal) {
    var vm = this;

    angular.extend(vm, {
      toggleEdit: toggleEdit,
      saveDose: saveDose,
      saveFrequency: saveFrequency,
      saveRemark: saveRemark,
      getTimeslotCount: getTimeslotCount,
      checkTimeslotAndFrequency: checkTimeslotAndFrequency,
      timeslotFrequencyNotMatchMessage: timeslotFrequencyNotMatchMessage,
      setTimingLabel: setTimingLabel,

      saveOrder: saveOrder,
      addOrder: addOrder,

      openModal: openModal,
      closeModal: closeModal
    });

    init();

    function init() {
      vm.carePlan = $state.params.carePlan;
      vm.activity = $state.params.activity;

      vm.from = $state.params.from;
      vm.medicationOrder = vm.activity.medicationOrderModel;

      vm.toggleEditFlag = false;
      vm.validator = true;

      $scope.$on('validator', function($event, valid) {
        vm.validator = valid;
      });

      onLoad();
      initFields();
    }

    function onLoad() {
      MedicationCarePlanService.carePlanResource.findTimeslotTime(function(response) {
        vm.timeslotTime = response.data;
        angular.forEach(vm.timeslotTime, function(data) {
          angular.forEach(vm.activity.timeslotActivityModelList, function(innerData) {
            if (innerData.timeslotCode === data.timeslot.code && innerData.status === CONSTANT.TIMESLOT_ACTIVITY_ACTIVE) {
              data.isChecked = true;
            }
          });
        });
      });

      dictService.get({
        groupname: 'timing'
      }).$promise.then(function(response) {
        vm.timingSourceDict = response.data;
      });

    }

    // init all controller level fields
    function initFields() {
      vm.dose = vm.medicationOrder.dose;
      vm.startOfPeriod = new Date(vm.medicationOrder.startOfPeriod);
      vm.min = new Date();
      vm.remark = vm.medicationOrder.remark;
    }

    function saveDose() {
      if (vm.dose) {
        vm.medicationOrder.dose = vm.dose;
      }
      vm.closeModal();
    }

    function saveFrequency() {
      //TODO  change the vm.medicationOrder.timing.label from the directive.
      setTimingLabel();

      if (!vm.activity.timeslotActivityModelList) {
        vm.activity.timeslotActivityModelList = [];
      }

      if (vm.activity.timeslotActivityModelList.length === 0) {
        angular.forEach(vm.timeslotTime, function(data) {
          var model = {
            'carePlanActivityOid': vm.activity.oid,
            'mobileOid': vm.activity.medicationOrderModel.mobileOid,
            'status': CONSTANT.TIMESLOT_ACTIVITY_INACTIVE,
            'timeslotCode': data.timeslot.code
          };
          vm.activity.timeslotActivityModelList.push(model);
        });
      }

      angular.forEach(vm.timeslotTime, function(data) {
        angular.forEach(vm.activity.timeslotActivityModelList, function(innerData) {
          if (innerData.timeslotCode === data.timeslot.code && data.isChecked) {
            innerData.status = CONSTANT.TIMESLOT_ACTIVITY_ACTIVE;
          } else if (innerData.timeslotCode === data.timeslot.code && !data.isChecked) {
            innerData.status = CONSTANT.TIMESLOT_ACTIVITY_INACTIVE;
          }
        });
      });

      var suiteabled = vm.checkTimeslotAndFrequency();
      if (!suiteabled) {
        vm.timeslotFrequencyNotMatchMessage();
        return;
      }

      vm.closeModal();
    }

    function setTimingLabel() {
      angular.forEach(vm.timingSourceDict, function(data) {
        if (vm.medicationOrder.timing.code === data.code) {
          vm.medicationOrder.timing.label = data.label;
        }
      });
    }

    function getTimeslotCount(timeslotActivityModelList) {
      var count = 0;
      angular.forEach(timeslotActivityModelList, function(data) {
        if (data.status === CONSTANT.TIMESLOT_ACTIVITY_ACTIVE) {
          count++;
        }
      });
      return count;
    }

    function timeslotFrequencyNotMatchMessage() {
      $fdPopup.show({
        title: $translate.instant('TIMESLOT_FREQUENCY_NOT_MATCH'),
        template: $translate.instant(''),
        buttons: [{
          text: $translate.instant('CAREPLAN_CONFIRM_BUTTON'),
          type: 'button-positive'
        }]
      });
    }

    function saveRemark() {
      if (vm.remark) {
        vm.medicationOrder.remark = vm.remark;
      }
      vm.closeModal();
    }

    function saveOrder() {
      // save medication;
      if (vm.toggleEditFlag) {
        MedicationCarePlanService.carePlanResource.saveCarePlan(vm.carePlan, function(response) {
          // set refreshed be data to view
          vm.carePlan = response.data;
          // vm.medicationCarePlan = response.data;
          $fdPopup.show({
            title: $translate.instant('CAREPLAN_UPDATE_MEDICATION_SUCCESS'),
            template: $translate.instant(''),
            buttons: [{
              text: $translate.instant('CAREPLAN_CONFIRM_BUTTON'),
              type: 'button-positive'
            }]
          });
          $state.go('home.carePlan.medication');
        });
      }
    }

    // toggle view/edit mode
    function toggleEdit() {
      //check whether the medication's timeslot match its frequency
      var suiteabled = vm.checkTimeslotAndFrequency();
      if (!suiteabled) {
        vm.timeslotFrequencyNotMatchMessage();
        return;
      }
      // save medication;
      saveOrder();
      // toggle flag
      vm.toggleEditFlag = !vm.toggleEditFlag;
    }

    function addOrder() {
      if (vm.toggleEditFlag) {
        //check whether the medication's timeslot match its frequency
        var suiteabled = vm.checkTimeslotAndFrequency();
        if (!suiteabled) {
          vm.timeslotFrequencyNotMatchMessage();
          return;
        }
        // TODO error handling
        var maxSequence;
        if (vm.carePlan.activities) {
          maxSequence = vm.carePlan.activities.length; // TODO get max
        } else {
          //TODO
          maxSequence = 100;
        }
        vm.activity.sequence = maxSequence;
        vm.carePlan.activities.push(vm.activity);

        MedicationCarePlanService.carePlanResource.saveCarePlan(vm.carePlan, function() {
          $state.go('home.carePlan.medication');
        });
      }

      vm.toggleEditFlag = !vm.toggleEditFlag;
    }

    /**
     * Check whether the medication's timeslot match its frequency
     */
    function checkTimeslotAndFrequency() {
      var count = vm.getTimeslotCount(vm.activity.timeslotActivityModelList);
      var flag = true;
      if ((vm.activity.medicationOrderModel.timing.code === 'QD' ||
          vm.activity.medicationOrderModel.timing.code === 'QWK' ||
          vm.activity.medicationOrderModel.timing.code === 'QMT' ||
          vm.activity.medicationOrderModel.timing.code === 'Q2W') &&
        count !== 1) {
        flag = false;
      } else if (vm.activity.medicationOrderModel.timing.code === 'BID' && count !== 2) {
        flag = false;
      } else if (vm.activity.medicationOrderModel.timing.code === 'TID' && count !== 3) {
        flag = false;
      } else if (vm.activity.medicationOrderModel.timing.code === 'QID' && count !== 4) {
        flag = false;
      } else if (!vm.activity.medicationOrderModel.timing.code && count !== 0) {
        flag = false;
      }
      return flag;
    }

    function openModal(field) {
      var modalTemplates = {
        dose: 'care-plan/medication/modal/edit-dose.modal.html',
        frequency: 'care-plan/medication/modal/edit-frequency.modal.html',
        startOfPeriod: 'care-plan/medication/modal/edit-start-of-period.modal.html',
      };

      var modalTemplate = modalTemplates[field];
      if (!modalTemplate) {
        return;
      }

      $ionicModal.fromTemplateUrl(modalTemplate, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        initFields();

        vm.modal = modal;
        vm.modal.show();
      });
    }

    function closeModal() {
      vm.modal.hide();
    }
  }
})();
