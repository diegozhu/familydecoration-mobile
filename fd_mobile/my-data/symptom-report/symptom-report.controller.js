(function() {
  'use strict';

  angular
    .module('fdmobile.symptomReport')
    .controller('SymptomReportController', SymptomReportController);

  function SymptomReportController($translate, $fdToast, $ionicLoading, $q, $scope, $ionicModal, $cordovaCamera, symptomReportService) {
    var vm = this,
      lo = window._,
      modals = [{
        name: 'addReport',
        url: 'my-data/symptom-report/modal/add-report.modal.html'
      }, {
        name: 'showPic',
        url: 'my-data/symptom-report/modal/show-pic.modal.html'
      }];

    angular.extend(vm, {
      openModal: openModal,
      closeModal: closeModal,
      camera: camera,
      addReport: addReport
    });

    init();

    function init() {
      vm.tags = symptomReportService.getTags();

      modals.forEach(function(modal) {
        $ionicModal.fromTemplateUrl(modal.url, {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(res) {
          vm[modal.name + 'Modal'] = res;
        });
      });

      getReportList();
    }

    function openModal(name, imgurl) {
      if (!imgurl) {
        vm.imgurls = [];
        vm.report = {
          symptomCode: 'inspection',
          reportComment: ''
        };
      } else {
        vm.imgurl = imgurl;
      }

      vm[name + 'Modal'].show();
    }

    function closeModal(name) {
      vm[name + 'Modal'].hide();
    }

    function getReportList() {
      symptomReportService.getReportList().then(function(response) {
        vm.reports = lo.forEach(response.data, function(o) {
          var imglist = [];

          lo.forEach(o.pictureName.split(','), function(i) {
            imglist.push(i.split('.jpeg')[0]);
          });

          o.name = vm.tags[o.symptomCode];
          o.imglist = imglist;
        });
      });
    }

    function camera() {
      $cordovaCamera.getPicture({
        quality: 100,
        mediaType: 0,
        destinationType: 1,
        saveToPhotoAlbum: true
      }).then(function(imgurl) {
        vm.imgurls.push(imgurl);
      });
    }

    function addReport() {
      var defs = [],
        formdata = new FormData();

      formdata.append('symptomCode', vm.report.symptomCode);
      formdata.append('reportComment', vm.report.reportComment);
      formdata.append('uploadTimestamp', new Date());

      if (vm.imgurls.length) {
        $ionicLoading.show({
          template: $translate.instant('SYMPTOM_REPORT_UPLOADING')
        });

        lo.forEach(vm.imgurls, function(imgurl) {
          var deferred = $q.defer();

          window.resolveLocalFileSystemURL(imgurl, function(fileEntry) {
            fileEntry.file(function(file) {
              var reader = new FileReader();

              reader.onloadend = function() {
                var imgBlob = new Blob([this.result], {type: 'image/jpeg'});
                formdata.append('files', imgBlob);
                deferred.resolve();
              };
              reader.readAsArrayBuffer(file);
            });
          });

          defs.push(deferred.promise);
        });

        $q.all(defs).then(function() {
          symptomReportService.addReport(formdata).success(function() {
            getReportList();
            $ionicLoading.hide().then(function() {
              vm.closeModal('addReport');
            });
          }).error(function() {
            $ionicLoading.hide();
          });
        });
      } else {
        $fdToast.show({
          text: $translate.instant('SYMPTOM_REPORT_UPLOADING_MSG')
        });
      }
    }
  }
})();
