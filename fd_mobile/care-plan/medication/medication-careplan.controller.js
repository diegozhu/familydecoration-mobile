(function() {
  'use strict';

  angular
    .module('fdmobile.medication')
    .controller('MedicationCarePlanController', MedicationCarePlanController);

  function MedicationCarePlanController($cordovaLocalNotification, MedicationCarePlanService, $translate, $fdPopup, MedicationCareplanVariableService, $state, CONSTANT) {
    var vm = this;

    // vm.findActiveMedicationOrder = findActiveMedicationOrder;
    // vm.findStoppedMedicationOrder = findStoppedMedicationOrder;
    // vm.activeMedication = activeMedication;
    angular.extend(vm, {
      toggleEdit: toggleEdit,
      toggleTimeslotEdit: toggleTimeslotEdit,
      stopMedication: stopMedication,
      saveTimeslotTime: saveTimeslotTime,
      showAsScheduler: showAsScheduler,
      showAsList: showAsList,
      gotoMedicationOrderPage: gotoMedicationOrderPage,
      gotoAddMedicationOrderPage: gotoAddMedicationOrderPage
    });

    init();

    function init() {
      vm.medicationCarePlan = null;
      vm.timeslotModelList = [];
      vm.toggleEditFlag = false;
      //TODO
      vm.showAsSchedulerFlag = false;
      vm.timeslotEditFlag = false;
      vm.stoppedStatus = {
        code: CONSTANT.CAREPLAN_MEDICATION_ORDER_STATUS_STOPPED
      };

      onLoad();
    }

    function onLoad() {
      MedicationCarePlanService.carePlanResource.findCarePlanAsScheduler(function(response) {
        initCarePlanData(response.data);
      });
    }

    function initCarePlanData(careplan) {
      MedicationCarePlanService.setMedicationCarePlan(careplan || {});
      vm.medicationCarePlan = MedicationCarePlanService.getMedicationCarePlan();

      if (vm.medicationCarePlan.activities.length !== 0) {
        persistentOptionsModel();
      }
    }

    function persistentOptionsModel() {
       //make options data persistent for other pages to use.
      MedicationCareplanVariableService.getOptionsModel().timingOptions = vm.medicationCarePlan.activities[0].medicationOrderModel.timing && vm.medicationCarePlan.activities[0].medicationOrderModel.timing.options || [];
      MedicationCareplanVariableService.getOptionsModel().methodOptions = vm.medicationCarePlan.activities[0].medicationOrderModel.method && vm.medicationCarePlan.activities[0].medicationOrderModel.method.options || [];
      MedicationCareplanVariableService.getOptionsModel().sourceOptions = vm.medicationCarePlan.activities[0].medicationOrderModel.source && vm.medicationCarePlan.activities[0].medicationOrderModel.source.options || [];
      MedicationCareplanVariableService.getOptionsModel().reviseReasonOptions = vm.medicationCarePlan.activities[0].medicationOrderModel.reviseReason && vm.medicationCarePlan.activities[0].medicationOrderModel.reviseReason.options || [];
    }

    function stopMedication(activity) {
      $fdPopup.show({
        iconClass: 'ion-help',
        title: $translate.instant('CAREPLAN_CONFIRM'),
        template: $translate.instant('CAREPLAN_CONFIRM_DELETE_MEDICINE'),
        buttons: [
          {
            text: $translate.instant('CAREPLAN_CONFIRM_BUTTON'),
            type: 'button-positive',
            onTap: function() {
              // stop medication;
              activity.medicationOrderModel.status = vm.stoppedStatus;
            }
          }, {
            text: $translate.instant('CAREPLAN_CANCEL_BUTTON'),
            type: 'button-stable'
          }
        ]
      });
    }

    function saveTimeslotTime() {
      if (vm.timeslotEditFlag) {
        // prepare the timeslot model list.
        var mobileOid = vm.medicationCarePlan.activities[0].medicationOrderModel.mobileOid;
        vm.medicationCarePlan.activityGroupByTimeslotList.forEach(function(e) {
          var timeslotModel = {
            'oid': e.oid,
            'mobileOid': mobileOid,
            'timeslot': e.timeslot,
            'time': e.time,
            'sequence': e.sequence,
            'templateOid': e.templateOid
          };
          vm.timeslotModelList.push(timeslotModel);
        });
        MedicationCarePlanService.carePlanResource.saveOrUpdateTimeslot(vm.timeslotModelList).$promise.then(function() {
          vm.timeslotModelList.forEach(function(e) {
            var timeset = e.time.split(':');

            $cordovaLocalNotification.update({
              id: e.timeslot.code,
              at: CONSTANT.TODAY.setHours(timeset[0], timeset[1], timeset[2])
            });
          });

          $fdPopup.show({
            title: $translate.instant('TIMESLOT_TIME_UPDATE_SUCCESS'),
            template: $translate.instant(''),
            buttons: [{
              text: $translate.instant('CAREPLAN_CONFIRM_BUTTON'),
              type: 'button-positive'
            }]
          });
          init();
          vm.showAsSchedulerFlag = true;
        });
      }
    }

    function showAsList() {
      vm.showAsSchedulerFlag = false;
    }

    function showAsScheduler() {
      vm.showAsSchedulerFlag = true;
    }

    function saveMedicationCarePlan() {
      // save medication;
      if (vm.toggleEditFlag) {
        // TODO what about error from BE case
        var medicationCarePlan = MedicationCarePlanService.getMedicationCarePlan();

        MedicationCarePlanService.carePlanResource.saveCarePlan(medicationCarePlan, function(response) {
          initCarePlanData(response.data);
        });
      }
    }

    // toggle view/edit mode
    function toggleEdit() {
      // save careplan;
      saveMedicationCarePlan();
      // toggle flag
      vm.toggleEditFlag = !vm.toggleEditFlag;
    }

    // toggle view/edit mode for scheduler(displays with timeslot to time)
    function toggleTimeslotEdit() {
      //save timeslot to time model entities
      saveTimeslotTime();
      // toggle flag
      vm.timeslotEditFlag = !vm.timeslotEditFlag;
    }

    function gotoMedicationOrderPage(activity) {
      $state.go('medicationorder',
        {
          carePlan: MedicationCarePlanService.getMedicationCarePlan(),
          activity: activity,
          from: 'edit'
        });
    }

    function gotoAddMedicationOrderPage() {
      $state.go('medicationdict');
    }
  }
})();
// function findActiveMedicationOrder(activity) {
//   var code = activity.medicationOrderModel.status && activity.medicationOrderModel.status.code;
//   return code === CONSTANT.CAREPLAN_MEDICATION_ORDER_STATUS_ACTIVE;
// }

// function findStoppedMedicationOrder(activity) {
//   var code = activity.medicationOrderModel.status && activity.medicationOrderModel.status.code;
//   return code === CONSTANT.CAREPLAN_MEDICATION_ORDER_STATUS_STOPPED;
// }

// function activeMedication(activity) {
//   $fdPopup.show({
//     iconClass: 'ion-help',
//     title: $translate.instant('CAREPLAN_CONFIRM'),
//     template: $translate.instant('CAREPLAN_CONFIRM_REUSE_MEDICINE'),
//     buttons: [
//       {
//         text: $translate.instant('CAREPLAN_CONFIRM_BUTTON'),
//         type: 'button-positive',
//         onTap: function() {
//           // active medication;
//           var activeStatus = {
//             code: CONSTANT.CAREPLAN_MEDICATION_ORDER_STATUS_ACTIVE
//           };
//           activity.medicationOrderModel.status = activeStatus;
//         }
//       }, {
//         text: $translate.instant('CAREPLAN_CANCEL_BUTTON'),
//         type: 'button-stable'
//       }
//     ]
//   });
// }
