(function() {
  'use strict';

  angular
    .module('fdmobile.symptomStatement')
    .factory('symptomService', symptomService);

  function symptomService($resource, urlBuilder, CONSTANT, $ionicModal, $filter, $ionicLoading,
     $fdPopup, $state, $translate, symptomCarePlanService, $q, $http, $cordovaCamera) {

    var vm = {};

    var getViewAndModel = function() {
      return vm;
    };

    var setSymptomStatementTask = function(task) {
      vm.symptomStatementTask = task;
    };

    var getSymptomStatementTask = function() {
      return vm.symptomStatementTask;
    };

    var openModal = function(scope) {
      var modalTemplateUrl = getAddSymptomModalUrl(),
        viewAndModel = getViewAndModel();

      vm.symptomStatement = {};

      viewAndModel.dateTimePicker = initDateTime();

      return $ionicModal.fromTemplateUrl(modalTemplateUrl, {
        scope: scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        viewAndModel.symptomStatementAddModal = modal;
        viewAndModel.symptomStatementAddModal.show();

        scope.$on('$destroy', function() {
          if (viewAndModel.symptomStatementAddModal) {
            viewAndModel.symptomStatementAddModal.remove();
          }
        });

      });
    };

    var closeModal = function() {
      var viewAndModel = getViewAndModel();
      viewAndModel.symptomStatementAddModal.hide();
      setSymptomStatementTask(null);
    };

    var setViewAndModel = function(viewAndModel) {
      vm = viewAndModel;

      vm.closeSymptomStatementAddModal = closeModal;

      symptomTagsInit();

      vm.takeReport = takeReport;

      vm.symptomStatementAddList = [];

      vm.pictureCountChecked = true;
      //Binding methods
      vm.addSymptomStatement = addSymptomStatement;

      vm.showLoading = showLoading;

      vm.symptomStatementTask;
    };

    function symptomTagsInit() {
      symptomCarePlanService.getSymptomCarePlan().$promise.then(function(response) {
        var symptomCarePlan = response.data,
          //Only one activity
          symptomDicts = symptomCarePlan.activities[0].symptomOrder.symptoms,
          symptomTags = [];

        angular.forEach(symptomDicts, function(symptomDict) {
          var symptomTag = {};
          symptomTag.symptomCode = symptomDict.code;
          symptomTag.name = symptomDict.label;
          symptomTag.isTagged = false;
          symptomTag.type = 'symptom-statement';
          symptomTags.push(symptomTag);
        });

        getViewAndModel().symptomTags = symptomTags;
      });
    }

    function initDateTime() {
      var date = new Date();
      var now = new Date();
      var beforeDate = new Date(now.setDate(now.getDate() - 3));
      return {
        date: date,
        time: date,
        maxDate: date.getTime(),
        minDate: beforeDate.getTime(),
        maxTime: date.getTime()
      };
    }

    var hideLoding = function() {
      $ionicLoading.hide().then(function() {
        $state.go('home.myData.symptomStatementList', {}, { reload: true });
      });
    };

    var hideLoding2 = function() {
      $ionicLoading.hide().then(function() {
        $fdPopup.alert({
          template: $translate.instant('SYMPTOM_REPORT_UPLOAD_FAIL')
        });
      });
    };

    function uploadPics(symptomCodes, dateAsserted, statement, occuredDate) {
      var defs = [],
        fd = new FormData(),
        task = getSymptomStatementTask(),
        normalUrl = urlBuilder.build('symptomStatements'),
        taskOid,
        completeTaskUrl,
        isRequestCompleteTask = false;

      if (task) {
        isRequestCompleteTask = true;
        taskOid = task.oid;
        completeTaskUrl = urlBuilder.build('symptomStatements/task/' + taskOid + '/completion');
      }

      fd.append('symptomCodes', symptomCodes);
      fd.append('statement', statement);
      fd.append('dateAsserted', dateAsserted);
      fd.append('occuredDate', occuredDate);
      vm.symptomStatementAddList.forEach(function(i) {
        var deferred = $q.defer();
        window.resolveLocalFileSystemURL(i, function(fileEntry) {
          fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function() {
              var imgBlob = new Blob([this.result], {type: 'image/jpeg'});
              fd.append('files', imgBlob);
              deferred.resolve();
            };
            reader.readAsArrayBuffer(file);
          });
        });

        defs.push(deferred.promise);
      });

      $q.all(defs).then(function() {
        var request = {
          method: 'POST',
          url: isRequestCompleteTask ? encodeURI(completeTaskUrl) : encodeURI(normalUrl),
          data: fd,
          processData: false,
          contentType: false,
          headers: {'Content-Type': undefined}
        };

        $http(request).success(function() {
          if (isRequestCompleteTask) {
            $ionicLoading.hide().then(function() {
              closeModal();
              //invoke the init method from coaching plan to refresh the task list.
              vm.init();
            });
          } else {
            hideLoding();
          }
        }).error(function() {
          hideLoding2();
        });
      });
    }

    function addSymptomStatement(symptomCodes) {
      var dateAsserted = new Date();
      var statement = vm.symptomStatement.statement;
      if (angular.isUndefined(statement) || statement === null) {
        statement = '';
      }

      var occuredDate;
      var symptomOccurDate = vm.dateTimePicker.date;
      var symptomOccurTime = vm.dateTimePicker.time;

      if (symptomOccurDate && symptomOccurTime) {
        var occuredDateStr;

        symptomOccurDate = symptomOccurDate.getFullYear() + '-' +
          (symptomOccurDate.getMonth() + 1) + '-' + symptomOccurDate.getDate();

        symptomOccurTime = symptomOccurTime.getHours() + ':' +
          symptomOccurTime.getMinutes() + ':' + symptomOccurTime.getSeconds();

        occuredDateStr = symptomOccurDate + ' ' + symptomOccurTime;
        occuredDate = new Date(occuredDateStr);
      } else {
        occuredDate = dateAsserted;
      }

      uploadPics(symptomCodes, dateAsserted, statement, occuredDate);
    }

    function getSelectedSymptomTags() {
      var symptomTags;
      // symptomTags = vm.symptomTags.filter(tag => tag.isTagged === true);
      symptomTags = vm.symptomTags.filter(function(tag) {
        return tag.isTagged === true;
      });
      return symptomTags;
    }

    function takeReport() {
      $cordovaCamera.getPicture({
        quality: 100,
        destinationType: 1,
        mediaType: 0,
        saveToPhotoAlbum: true
      }).then(function(imageURL) {
        vm.symptomStatementAddList.push(imageURL);
        if (vm.symptomStatementAddList.length > 5) {
          vm.pictureCountChecked = false;
        }
        return vm.symptomStatementAddList;
      }, function() {
        return false;
      });
    }

    function showAlert() {
      $fdPopup.alert({
        template: $translate.instant('SYMPTOM_STATEMENT_CREATE_ALERT_TITLE')
      });
    }

    function showLoading() {
      var symptomTags = getSelectedSymptomTags();
      if (!symptomTags || symptomTags.length === 0) {
        //Reminder user to select at least one symptom tag.
        showAlert();
        return;
      }

      var symptomCodeArray = [];
      angular.forEach(symptomTags, function(s) {
        var code = s.symptomCode;
        symptomCodeArray.push(code);
      });

      $ionicLoading.show({
        template: $translate.instant('SYMPTOM_REPORT_UPLOADING'),
      }).then(function() {
        addSymptomStatement(symptomCodeArray.join(CONSTANT.COMMA));
      });
    }

    function getAddSymptomModalUrl() {
      return 'my-data/symptom-statement/modal/symptom-statement-add.modal.html';
    }

    return {
      setViewAndModel: setViewAndModel,
      openModal: openModal,
      setSymptomStatementTask: setSymptomStatementTask
    };
  }
})();
