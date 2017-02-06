(function() {
  'use strict';

  angular
    .module('fdmobile.symptomReport')
    .factory('symptomReportService', symptomReportService);

  function symptomReportService($http, $resource, urlBuilder, $translate) {
    return {
      getReportList: function() {
        return $resource(urlBuilder.build('symptomReport/list')).get().$promise;
      },
      addReport: function(formdata) {
        return $http({
          method: 'POST',
          url: encodeURI(urlBuilder.build('symptomReport/takeReport')),
          data: formdata,
          processData: false,
          contentType: false,
          headers: {'Content-Type': undefined}
        });
      },
      getTags: function() {
        return {
          'inspection': $translate.instant('SYMPTOM_REPORT_CHECK'),
          'image': $translate.instant('SYMPTOM_REPORT_IMAGE'),
          'ecg': $translate.instant('SYMPTOM_REPORT_HEART'),
          'other': $translate.instant('SYMPTOM_REPORT_OTHERS')
        };
      }
    };
  }
})();
