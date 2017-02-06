(function() {
  'use strict';

  angular
    .module('fdmobile.medication')
    .controller('MedicationDictController', MedicationDictController);

  MedicationDictController.$inject = ['MedicationService', '$translate', '$fdPopup', 'MedicationCarePlanService', 'MedicationCareplanVariableService', '$state', 'CONSTANT'];

  function MedicationDictController(MedicationService, $translate, $fdPopup, MedicationCarePlanService, MedicationCareplanVariableService, $state, CONSTANT) {
    var vm = this;

    vm.gotoEditMedicationOrder = gotoEditMedicationOrder;

    vm.queryByPinyinOrChar = queryByPinyinOrChar;
    vm.clearPinyinOrChar = clearPinyinOrChar;

    vm.medicationDicts = null;
    vm.selectedMedication = null;
    vm.querydata = null;

    MedicationService.getAllMedicationDict(function(response) {
      vm.medicationDicts = response.data;
    });

    function queryByPinyinOrChar() {
      //TODO merge to the next service.
      if (!vm.querydata) {
        MedicationService.getAllMedicationDict(function(response) {
          vm.medicationDicts = response.data;
        });
        return;
      }
      MedicationService.searchByPinyinOrChar({querydata: vm.querydata}, function(response) {
        vm.medicationDicts = response.data;
      });
    }

    function clearPinyinOrChar() {
      vm.querydata = '';
      //TODO merge to the next service.
      if (!vm.querydata) {
        MedicationService.getAllMedicationDict(function(response) {
          vm.medicationDicts = response.data;
        });
        return;
      }
    }

    function gotoEditMedicationOrder(medication) {

      var carePlan = MedicationCarePlanService.getMedicationCarePlan();
      var activity = {};

      // var dose = medication.dose;
      var method = {
        code: medication.methodCode,
        label: '',
        options: MedicationCareplanVariableService.getOptionsModel().methodOptions
      };

      var timing = {
        options: MedicationCareplanVariableService.getOptionsModel().timingOptions
      };

      var source = {
        options: MedicationCareplanVariableService.getOptionsModel().sourceOptions
      };

      var reviseReason = {
        options: MedicationCareplanVariableService.getOptionsModel().reviseReasonOptions
      };

      var startOfPeriod = new Date();
      var remark = medication.remark;

      activity.medicationOrderModel = {
        medication: medication,
        dose: medication.dose,
        timing: timing,
        method: method,
        source: source,
        unit: medication.unit,
        reviseReason: reviseReason,
        startOfPeriod: startOfPeriod,
        remark: remark
      };

      //judge whether the medication has been added
      var returnFlag = false;
      if (carePlan && carePlan.activities) {
        carePlan.activities.forEach(function(e) {
          if (medication.code === e.medicationOrderModel.medication.code && e.medicationOrderModel.status.code !== CONSTANT.CAREPLAN_MEDICATION_ORDER_STATUS_STOPPED) {
            $fdPopup.alert({
              title: $translate.instant('CAREPLAN_NOTICE'),
              template: $translate.instant('CAREPLAN_ADD_MEDICINE_MULTIPLE'),
            });
            returnFlag = true;
          }
        });
      }
      if (returnFlag === true) {
        return;
      }

      $state.go('medicationorder',
        {
          carePlan: carePlan,
          activity: activity,
          from: 'add'
        });
    }
  }
})();
