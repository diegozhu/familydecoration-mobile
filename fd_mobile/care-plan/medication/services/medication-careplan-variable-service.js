/**
 ***************************** medicatio ncareplan variable service *****************************
 *
 * Medication careplan variable service is used to store model data.
 */
'use strict';

(function() {
  angular
    .module('fdmobile.medication')
    .factory('MedicationCareplanVariableService', MedicationCareplanVariableService);

  function MedicationCareplanVariableService() {
    var optionsModel = {
      'timingOptions': '',
      'methodOptions': '',
      'sourceOptions': '',
      'reviseReasonOptions': ''
    };

    return {
      getOptionsModel: function() {
        return optionsModel;
      }
    };
  }
})();
