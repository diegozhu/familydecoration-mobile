/**
 ***************************** MedicationCarePlanService *****************************
 *
 * MedicationCarePlanService is used to interact with the RESTful web webserice.
 *
 */
'use strict';

(function() {
  angular
    .module('fdmobile.medication')
    .factory('MedicationCarePlanService', MedicationCarePlanService);

  // Injecting necessary dependentencies in this way for improve optimization
  MedicationCarePlanService.$inject = ['$resource', 'urlBuilder'];

  function MedicationCarePlanService($resource, urlBuilder) {
    // shared model cross controllers
    var medicationCarePlan = {};

    // rest resource apis
    var carePlanResource = $resource(urlBuilder.build('care-plan'), {}, {
      findCarePlan: {
        method: 'GET',
        url: urlBuilder.build('care-plan/mobile/medication')
      },
      findCarePlanAsScheduler: {
        method: 'GET',
        url: urlBuilder.build('care-plan/mobile/medication/activities-group-by-timeslot')
      },
      findTimeslotTime: {
        method: 'GET',
        url: urlBuilder.build('timeslot-time/mobile/template')
      },
      saveOrUpdateTimeslot: {
        method: 'POST',
        url: urlBuilder.build('timeslot-time/save-or-update-list')
      },
      saveCarePlan: {
        method: 'PUT',
        url: urlBuilder.build('care-plan/mobile/medication-care-plan')
      }
    });

    // service apis

    // model op apis
    var getMedicationCarePlan = function() {
      return medicationCarePlan;
    };
    var setMedicationCarePlan = function(careplan) {
      medicationCarePlan = careplan;
    };

    return {
      carePlanResource: carePlanResource,
      getMedicationCarePlan: getMedicationCarePlan,
      setMedicationCarePlan: setMedicationCarePlan
    };
  }
})();
