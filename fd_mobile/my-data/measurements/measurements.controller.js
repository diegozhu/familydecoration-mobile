(function() {
  'use strict';

  angular
    .module('fdmobile.measurements')
    .controller('MeasurementsController', MeasurementsController);

  function MeasurementsController($log, $scope, $ionicModal, $filter, measurementsService, CONSTANT, $state, $translate, $stateParams) {
    var vm = this;

    angular.extend(vm, {
      openChart: openChart,
      openModal: measurementsService.openModal,
      addObservation: addObservation
    });

    init();

    function init() {
      measurementsService.setViewAndModel(vm, $scope);
      initMeasurementsService();
      if ($stateParams.measureRightNow) {
        measurementsService.openModal($stateParams.measurementType);
      }
    }

    function addObservation(measurementType) {
      var code = CONSTANT[measurementType],
        observationModels = measurementsService.buildObservationModels(code);

      measurementsService.getResource().addMeasurementsBatch(observationModels)
        .$promise
        .then(function() {
          switch (code) {
            //bluetooth
            case CONSTANT.MEASUREMENT_BLUETOOTH_CODE:
              refreshUIData(CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, 'systolicBloodPressure');
              refreshUIData(CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, 'diastolicBloodPressure');
              refreshUIData(CONSTANT.HEART_RATE_CODE, 'heartRate');
              break;
            // blood pressure
            case CONSTANT.BLOOD_PRESSURE_CODE:
              refreshUIData(CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, 'systolicBloodPressure');
              refreshUIData(CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, 'diastolicBloodPressure');
              break;
            // Heart Rate
            case CONSTANT.HEART_RATE_CODE:
              refreshUIData(code, 'heartRate');
              break;
            // fbp
            case CONSTANT.FASTING_BLOOD_GLUCOSE_CODE:
              refreshUIData(code, 'fastingBloodGlucose');
              break;
            // pbp
            case CONSTANT.POSTPRANDIAL_BLOOD_GLUCOSE_CODE:
              refreshUIData(code, 'prandialBloodGlucose');
              break;
            //weight
            case CONSTANT.WEIGHT_CODE:
              refreshUIData(code, 'weight');
              break;
          }
          measurementsService.closeModal();
        });
    }

    function refreshUIData(code, vmField) {
      measurementsService.getResource().displayMeasurementsService({code: code}, function(response) {
        vm[vmField] = response.data;
      });
    }

    function initMeasurementsService() {
      refreshUIData(CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, 'systolicBloodPressure');
      refreshUIData(CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, 'diastolicBloodPressure');
      refreshUIData(CONSTANT.HEART_RATE_CODE, 'heartRate');
      refreshUIData(CONSTANT.WEIGHT_CODE, 'weight');
      refreshUIData(CONSTANT.FASTING_BLOOD_GLUCOSE_CODE, 'fastingBloodGlucose');
      refreshUIData(CONSTANT.POSTPRANDIAL_BLOOD_GLUCOSE_CODE, 'prandialBloodGlucose');
    }

    function openChart(measurementType) {
      $state.go('chart', {'measurementType': measurementType});
    }
  }
})();
