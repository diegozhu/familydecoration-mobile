(function() {
  'use strict';

  angular
    .module('fdmobile.coach')
    .controller('CoachController', CoachController);

  function CoachController($templateCache, CONSTANT, $scope, $state,
    $ionicModal, $fdPopup, $translate, $ionicPlatform, $cordovaLocalNotification,
    measurementsService, taskService, taskNewService, authenticationService,
    mobileComplianceService, educationCoachingService, symptomService) {

    var vm = this,
      modalUrl = 'coach/modal/medicine-intake.modal.html';

    angular.extend(vm, {
      setIcon: setIcon,
      doTask: doTask,
      openModal: openModal,
      closeModal: closeModal,
      logout: logout,
      showTip: showTip,
      medTaskDone: medTaskDone,
      medTaskSnooze: medTaskSnooze,
      coachTaskDone: coachTaskDone,
      openComplianceScoreModal: openComplianceScoreModal,
      closeComplianceScoreModal: closeComplianceScoreModal,
      addObservation: addObservation,

      //For observation add part
      //closeObservationModal and addObservation have been defined in the modal view,
      //do not use other function name bind to vm.
      init: init,
      complianceScore: {score: 0}
      //For observation add part
    });

    init();

    function init() {
      var username = localStorage.getItem('username'),
        password = localStorage.getItem('password');

      if (!!username && !!password) {
        authenticationService.login({
          username: username,
          password: password
        }).$promise.then(function() {
          $ionicModal.fromTemplateUrl(modalUrl, {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            vm.modal = modal;
          });

          taskService.get().$promise.then(getTaskComplete);

          scorePanelInit();

          measurementsService.setViewAndModel(vm, $scope);
          symptomService.setViewAndModel(vm);
        });
      } else {
        $state.go('login');
      }
    }


    function addObservation(measurementType) {
      var code = CONSTANT[measurementType],
        completeDatetime = new Date(),
        observations = measurementsService.buildObservationModels(code),
        observationTasks = [];

      // bluetooth measurement measures blood pressure and heart rate at the same time. so need to complete all relavent task.
      if (measurementType === 'MEASUREMENT_BLUETOOTH_CODE') {
        vm.tasks.every(function(task) {
          var code = task.carePlanActivityType.code;
          var const1 = CONSTANT.CAREPLAN_ACTIVITY_BLOOD_PRESSURE_MEASUREMENT; //blood pressure
          var const2 = CONSTANT.CAREPLAN_ACTIVITY_HEART_RATE_MEASUREMENT; //heart rate
          if (code === const1 || code === const2) {
            task.observations = observations;
            task.completeDatetime = completeDatetime;
            observationTasks.push(task);
          }
          return true;
        });
      } else {
        vm.measurement.observations = observations;
        observationTasks.push(vm.measurement);
      }

      measurementsService.completeMeasurementTask(observationTasks)
        .$promise
        .then(function() {
          taskService.get().$promise.then(function(response) {
            vm.tasks = response.data;
          });
          measurementsService.closeModal();
          init();
        });
    }

    function getTaskComplete(response) {
      var tasks = response.data,
        schedule = [],
        frequency = CONSTANT.IS_ANDROID ? CONSTANT.NOTIFICATION_FREQUENCY_ANDROID : CONSTANT.NOTIFICATION_FREQUENCY_IOS;

      vm.tasks = tasks;

      for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];

        if (task.carePlanActivityType.code === CONSTANT.CAREPLAN_ACTIVITY_MEDICATION_INTAKE) {
          var timeset = task.time.split(':');

          schedule.push({
            id: task.timeslot.code,
            title: $translate.instant('COMMON_INTAKE_NOTIFICATION_TITLE'),
            text: $translate.instant('COMMON_INTAKE_NOTIFICATION_TEXT_1') + task.timeslot.label + $translate.instant('COMMON_INTAKE_NOTIFICATION_TEXT_2'),
            at: CONSTANT.TODAY.setHours(timeset[0], timeset[1], timeset[2]),
            every: frequency,
            sound: 'file://assets/sounds/tune.mp3',
            data: task
          });
        }
      }

      $ionicPlatform.ready(function() {
        schedule.forEach(function(s) {
          $cordovaLocalNotification.isPresent(s.id).then(function(present) {
            if (!present) {
              $cordovaLocalNotification.schedule(s);
            }
          });
        });
      });
    }

    function medTaskDone() {
      vm.med.date = CONSTANT.TODAY;
      $cordovaLocalNotification.cancel(vm.med.timeslot.code);

      taskNewService.finishTask(vm.med).$promise.then(function() {
        taskService.get().$promise.then(function(response) {
          vm.tasks = response.data;
          closeModal();
          scorePanelInit();
        });
      });
    }

    function medTaskSnooze() {
      $cordovaLocalNotification.update({
        id: vm.med.timeslot.code,
        at: CONSTANT.TODAY.getTime() + CONSTANT.NOTIFICATION_FREQUENCY_ANDROID * 60 * 1000
      }).then(function() {
        closeModal();
      });
    }

    function coachTaskDone(index) {
      vm.coachTaskData = vm.tasks[index];
      educationCoachingService.doCoachTask(vm.coachTaskData).$promise.then(function() {
        init();
      });
    }

    function logout() {
      authenticationService.logout();
      $templateCache.removeAll();
      localStorage.clear();
      $state.go('login');
    }

    function setIcon(index) {
      var iconClass,
        activityTypeCode = vm.tasks[index].carePlanActivityType.code;

      switch (activityTypeCode) {
        case CONSTANT.CAREPLAN_ACTIVITY_FOLLOWUP:
        case CONSTANT.CAREPLAN_ACTIVITY_MEDICATION_INTAKE:
          iconClass = 'icon-fd-intake';
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_BLOOD_PRESSURE_MEASUREMENT:
          iconClass = 'icon-fd-bloodpressure';
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_HEART_RATE_MEASUREMENT:
          iconClass = 'icon-fd-heartrate';
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_WEIGHT_MEASUREMENT:
          iconClass = 'icon-fd-weight';
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_EDUCATION_COACHING:
        case CONSTANT.CAREPLAN_ACTIVITY_FASTING_GLUCOSE_MEASUREMENT:
        case CONSTANT.CAREPLAN_ACTIVITY_POSTPRANDIAL_GLUCOSE_MEASUREMENT:
        case CONSTANT.CAREPLAN_ACTIVITY_SYMPTOM:
          iconClass = 'icon-fd-glucose';
          break;
      }

      return iconClass;
    }

    function doTask(index) {

      vm.medTaskCanChange = false;
      vm.snoozeButtonDisplay = true;

      var activityTypeCode = vm.tasks[index].carePlanActivityType.code,
        measurementType;

      switch (activityTypeCode) {
        case CONSTANT.CAREPLAN_ACTIVITY_FOLLOWUP:
        case CONSTANT.CAREPLAN_ACTIVITY_MEDICATION_INTAKE:
          vm.med = vm.tasks[index];
          angular.forEach(vm.med.medicationTaskModelList, function(data) {
            data.isChecked = true;
          });

          var timeRemark = vm.med.time.split(':'),
            timeslotStamp = new Date().setHours(timeRemark[0], timeRemark[1], timeRemark[2]),
            hours = ( Math.abs((new Date()) - timeslotStamp )) / ( 3600 * 1000 );

          if ( (new Date()) > timeslotStamp ) {
            vm.medTaskCanChange = true;
            vm.snoozeButtonDisplay = false;
          } else if ( (new Date()) === timeslotStamp ) {
            vm.medTaskCanChange = true;
            vm.snoozeButtonDisplay = true;
          } else if ( (new Date()) < timeslotStamp && hours <= 2 ) {
            vm.medTaskCanChange = true;
            vm.snoozeButtonDisplay = false;
          } else if ( (new Date()) < timeslotStamp && hours > 2 ) {
            vm.medTaskCanChange = false;
            vm.snoozeButtonDisplay = false;
          }

          vm.openModal();
          break;
        //coaching tasks
        case CONSTANT.CAREPLAN_ACTIVITY_EDUCATION_COACHING:
          vm.coachTaskDone(index);
          //TODO
          $state.go('home.carePlan');
          break;
        //Measurement part start
        case CONSTANT.CAREPLAN_ACTIVITY_BLOOD_PRESSURE_MEASUREMENT:  //blood pressure
          measurementType = 'BLOOD_PRESSURE_CODE';
          vm.measurement = vm.tasks[index];
          measurementsService.openModal(measurementType);
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_HEART_RATE_MEASUREMENT:  //heat rate
          measurementType = 'HEART_RATE_CODE';
          vm.measurement = vm.tasks[index];
          measurementsService.openModal(measurementType);
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_WEIGHT_MEASUREMENT:  //weight
          measurementType = 'WEIGHT_CODE';
          vm.measurement = vm.tasks[index];
          measurementsService.openModal(measurementType);
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_FASTING_GLUCOSE_MEASUREMENT: //fbg
          measurementType = 'FASTING_BLOOD_GLUCOSE_CODE';
          vm.measurement = vm.tasks[index];
          measurementsService.openModal(measurementType);
          break;
        case CONSTANT.CAREPLAN_ACTIVITY_POSTPRANDIAL_GLUCOSE_MEASUREMENT: //pbg
          measurementType = 'POSTPRANDIAL_BLOOD_GLUCOSE_CODE';
          vm.measurement = vm.tasks[index];
          measurementsService.openModal(measurementType);
          break;
        //Measurement part end
        case CONSTANT.CAREPLAN_ACTIVITY_EDUCATION_MEASUREMENT:
        case CONSTANT.CAREPLAN_ACTIVITY_SYMPTOM:
          symptomService.setSymptomStatementTask(vm.tasks[index]);
          symptomService.openModal($scope);
          break;

      }
    }

    function openModal() {
      vm.modal.show();
    }

    function closeModal() {
      vm.modal.hide();
    }

    function showTip() {
      $fdPopup.show({
        iconClass: 'ion-star',
        title: 'todo',
        template: 'todo',
        buttons: [{
          text: 'todo',
          type: 'button-positive'
        }]
      });
    }

    function scorePanelInit() {
      mobileComplianceService.get().$promise.then(function(response) {
        var complianceScoreModel = response.data,
          score = complianceScoreModel.score,
          minValue = complianceScoreModel.complianceScoreStandardReference.minValue,
          maxValue = complianceScoreModel.complianceScoreStandardReference.maxValue,
          dogStatus = 'stable',
          statusTitle,
          statusSubtitle;

        if (score >= minValue && score <= maxValue) {
          dogStatus = 'stable';
          statusTitle = $translate.instant('COACH_COMPLIANCE_SCORE_STABLE_TITLE');
          statusSubtitle = $translate.instant('COACH_COMPLIANCE_SCORE_STABLE_SUBTITLE');
        } else if (score > maxValue) {
          dogStatus = 'up';
          statusTitle = $translate.instant('COACH_COMPLIANCE_SCORE_UP_TITLE');
          statusSubtitle = $translate.instant('COACH_COMPLIANCE_SCORE_UP_SUBTITLE');
        } else if (score < minValue) {
          dogStatus = 'down';
          statusTitle = $translate.instant('COACH_COMPLIANCE_SCORE_DOWN_TITLE');
          statusSubtitle = $translate.instant('COACH_COMPLIANCE_SCORE_DOWN_SUBTITLE');
        }

        complianceScoreModel.dogStatus = dogStatus;
        complianceScoreModel.statusTitle = statusTitle;
        complianceScoreModel.statusSubtitle = statusSubtitle;

        vm.complianceScore = complianceScoreModel;
      });

      complianceScoreModalInit();
    }

    function complianceScoreModalInit() {
      var modalUrl = 'coach/modal/compliance-score.modal.html';

      $ionicModal.fromTemplateUrl(modalUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.complianceScoreModal = modal;
      });
    }

    function openComplianceScoreModal() {
      vm.complianceScoreModal.show();
    }

    function closeComplianceScoreModal() {
      vm.complianceScoreModal.hide();
    }
  }
})();
