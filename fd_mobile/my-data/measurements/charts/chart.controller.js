/**
 ****************************ChartController****************************
 */
'use strict';

(function() {
  angular.module('fdmobile.measurements')
    .controller('ChartController', ChartController);

  function ChartController($scope, $state, $stateParams, measurementsService, $translate) {
    var vm = this;

    vm.measurementType = $stateParams.measurementType;
    vm.initChart = initChart;
    vm.responseHandler = responseHandler;
    vm.buildXAxisCategories = buildXAxisCategories;
    vm.addMeasurement = addMeasurement;

    onactive();

    function onactive() {
      if (vm.measurementType) {
        switch (vm.measurementType) {
          case 'HEART_RATE_CODE':
            vm.chartTitle = $translate.instant('MEASUREMENT_CHART_TITLE_HEART_RATE');
            break;
          case 'BLOOD_PRESSURE_CODE':
            vm.chartTitle = $translate.instant('MEASUREMENT_CHART_TITLE_BLOOD_PRESSURE');
            break;
          case 'FASTING_BLOOD_GLUCOSE_CODE':
            vm.chartTitle = $translate.instant('MEASUREMENT_CHART_TITLE_FBG');
            break;
          case 'POSTPRANDIAL_BLOOD_GLUCOSE_CODE':
            vm.chartTitle = $translate.instant('MEASUREMENT_CHART_TITLE_PBG');
            break;
          case 'WEIGHT_CODE':
            vm.chartTitle = $translate.instant('MEASUREMENT_CHART_TITLE_WEIGHT');
            break;
        }

        measurementsService.setViewAndModel(vm, $scope);
      }
    }

    function addMeasurement() {
      $state.go('home.myData.measurements', {'measurementType': vm.measurementType, 'measureRightNow': true});
    }

    function initChart(interval, code, conditionCode) {
      var dates = buildDateRange(interval),
        dateFrom = dates[0],
        dateEnd = dates[interval],
        queryParams = {
          code: code,
          conditionCode: conditionCode,
          dateFrom: dateFrom,
          dateEnd: dateEnd
        };
      vm.dates = dates;
      return measurementsService.getResource().getLastObservationPerDay(queryParams);
    }

    function responseHandler(data) {
      var observations = data,
        observationMapArray = [],
        chartData = [];

      observations.forEach(function(observation) {
        var observationMap = {};
        observationMap.date = convertDateToString(new Date(observation.obserDate));
        observationMap.value = observation.value;
        observationMapArray.push(observationMap);
      });

      /*Add find method prototype start*/
      if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
          if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
          }
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }
          var list = Object(this);
          var length = list.length >>> 0;
          var thisArg = arguments[1];
          var value;

          for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
              return value;
            }
          }
          return undefined;
        };
      }
      /*Add find method prototype end*/

      vm.dates.forEach(function(date) {
        var tempObser = observationMapArray.find(function(obs) {
          return obs.date === date;
        });
        if (tempObser) {
          chartData.push(Number(tempObser.value));
        } else {
          // Put null to not display in the chart.
          chartData.push(null);
        }
      });
      return chartData;
    }

    /* The dateStrArr is a date string array,
     * the date is in the format: yyyy-m-dd,
     * for example: '2012-2-2'
     */
    function buildXAxisCategories() {
      var xAxisCategories = [];
      vm.dates.forEach(function(date) {
        var strs = date.split('-');
        xAxisCategories.push(strs[1] + '/' + strs[2]);
      });
      return xAxisCategories;
    }

    function buildDateRange(interval) {
      var dates = [],
        now = new Date(),
        currentDateStr = convertDateToString(now),
        currentDateStrArr = currentDateStr.split('-'),
        currentDate = new Date(currentDateStrArr[0], Number(currentDateStrArr[1]) - 1, currentDateStrArr[2]),
        currentDateMilliSeconds = currentDate.getTime(),
        millisecondsOfDay = 60 * 60 * 24 * 1000;

      for (var i = interval; i >= 0; i--) {
        var tempDate = new Date(currentDateMilliSeconds - i * millisecondsOfDay),
          tempDateStr = convertDateToString(tempDate);
        dates.push(tempDateStr);
      }

      return dates;
    }

    /* To build the date in the format of yyyy-m-dd */
    function convertDateToString(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
  }

})();
