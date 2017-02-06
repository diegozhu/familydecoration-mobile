/**
 *****************************Chart Directive *****************************
 */
'use strict';

(function() {
  angular.module('fdmobile.measurements')
  .directive('chart', chart);

  chart.$inject = ['CONSTANT', '$translate'];

  function chart(CONSTANT, $translate) {
    return {
      restrict: 'E',
      scope: {
        measurementType: '=',
        initChart: '=',
        responseHandler: '=',
        xaxisCategoriesBuilder: '='
      },
      replace: true,
      template: '<div id="container" class="chart-container" chart-data>not working</div>',
      link: linkFn
    };

    function linkFn($scope) {
      initButtonStatus($scope);

      switchChartByInterval($scope, CONSTANT.CHART_WEEKLY);
    }

    function switchChartByInterval($scope, interval) {
      if ($scope.measurementType) {
        switch ($scope.measurementType) {
          // Heart Rate
          case 'HEART_RATE_CODE':
            initChart($scope, interval, CONSTANT.HEART_RATE_CODE, '', $translate.instant('MEASUREMENT_HEART_RATE'), 'line');
            break;
          // BLOOD PRESSURE
          case 'BLOOD_PRESSURE_CODE':
            initBloodPressureChart($scope, interval, 'line');
            // initMornAndEvenBloodPressureChart($scope, interval, 'line');
            break;
          // fbp
          case 'FASTING_BLOOD_GLUCOSE_CODE':
            initChart($scope, interval, CONSTANT.FASTING_BLOOD_GLUCOSE_CODE, '', $translate.instant('MEASUREMENT_FBG'), 'line');
            break;
          // gbp
          case 'POSTPRANDIAL_BLOOD_GLUCOSE_CODE':
            initChart($scope, interval, CONSTANT.POSTPRANDIAL_BLOOD_GLUCOSE_CODE, '', $translate.instant('MEASUREMENT_PBG'), 'line');
            break;
          //weight chart
          case 'WEIGHT_CODE':
            initChart($scope, interval, CONSTANT.WEIGHT_CODE, '', $translate.instant('MEASUREMENT_WIGHT'), 'line');
            break;
        }
      }
    }

    function initChart($scope, interval, code, conditionCode, name, chartType) {
      $scope.initChart(interval, code, conditionCode).$promise.then(function(response) {
        var data = $scope.responseHandler(response.data),
          xAxisCategories = $scope.xaxisCategoriesBuilder(),
          series = [],
          chartConfig = {};

        series.push(configSerie(data, name));
        chartConfig = {
          chartType: chartType,
          series: series,
          xAxisCategories: xAxisCategories,
          plotBands: null,
          tickInterval: null
        };
        buildHighChart(chartConfig);
      });
    }

    function initBloodPressureChart($scope, interval, chartType) {
      //normal systolic blood pressure
      $scope.initChart(interval, CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, '').$promise.then(function(response) {
        var sbpdata = $scope.responseHandler(response.data);
          //normal diastolic blood pressure
        $scope.initChart(interval, CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, '').$promise.then(function(response) {
          var dbpdata = $scope.responseHandler(response.data),
            xAxisCategories = $scope.xaxisCategoriesBuilder(),
            plotBands = [{
              from: 60,
              to: 90,
              color: 'rgba(245, 245, 235, 1)'
            }, {
              from: 90,
              to: 140,
              color: 'rgba(230, 238, 239, 1)'
            }],
            series = [],
            chartConfig = {};

          series.push(configSerie(sbpdata, $translate.instant('MEASUREMENT_SYSTOLIC')));
          series.push(configSerie(dbpdata, $translate.instant('MEASUREMENT_DIASTOLIC')));

          chartConfig = {
            chartType: chartType,
            series: series,
            xAxisCategories: xAxisCategories,
            plotBands: plotBands,
            tickInterval: 20
          };

          buildHighChart(chartConfig);
        });
      });
    }

/*    function initMornAndEvenBloodPressureChart($scope, interval, chartType) {
      // Morning systolic blood pressure
      $scope.initChart(interval, CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, CONSTANT.MEASUREMENT_CONDITION_MORNING_CODE).$promise.then(function(response) {
        var mornSbpdata = $scope.responseHandler(response.data);

          // Morning diastolic blood pressure
        $scope.initChart(interval, CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, CONSTANT.MEASUREMENT_CONDITION_MORNING_CODE).$promise.then(function(response) {
          var mornDbpdata = $scope.responseHandler(response.data);

          // Evening systolic blood pressure
          $scope.initChart(interval, CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, CONSTANT.MEASUREMENT_CONDITION_EVENING_CODE).$promise.then(function(response) {
            var evenSbpdata = $scope.responseHandler(response.data);

            // Evening diastolic blood pressure
            $scope.initChart(interval, CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, CONSTANT.MEASUREMENT_CONDITION_EVENING_CODE).$promise.then(function(response) {
              var evenDbpdata = $scope.responseHandler(response.data),
                xAxisCategories = $scope.xaxisCategoriesBuilder(),
                plotBands = [{
                  from: 60,
                  to: 90,
                  color: 'rgba(245, 245, 235, 1)'
                }, {
                  from: 90,
                  to: 140,
                  color: 'rgba(230, 238, 239, 1)'
                }],
                series = [];

              series.push(configSerie(mornSbpdata));
              series.push(configSerie(mornDbpdata));

              series.push(configSerie(evenSbpdata));
              series.push(configSerie(evenDbpdata));

              buildHighChart(series, xAxisCategories, plotBands, chartType);

            });
          });
        });
      });
    }*/

    function initButtonStatus($scope) {
      var weekButton = angular.element(document.querySelector('#weekButton')),
        monthButton = angular.element(document.querySelector('#monthButton'));

      //The weekButton is clicked status by default, and monthButton is not clicked status
      if (weekButton && monthButton) {
        weekButton.addClass('active');

        bindClickEventToButton(weekButton, monthButton, $scope);
      }
    }

    function bindClickEventToButton(weekButton, monthButton, $scope) {
      weekButton.bind('click', function() {
        weekButton.addClass('active');
        monthButton.removeClass('active');

        switchChartByInterval($scope, CONSTANT.CHART_WEEKLY);
      });

      monthButton.bind('click', function() {
        monthButton.addClass('active');
        weekButton.removeClass('active');

        switchChartByInterval($scope, CONSTANT.CHART_MONTHLY);
      });
    }

    function configSerie(data, name) {
      var serie = {
        color: '#86C5DC',
        data: data,
        name: name,
        showInLegend: false
      };
      return serie;
    }

    function buildHighChart(chartConfig) {

      new window.Highcharts.Chart({
        chart: {
          type: chartConfig.chartType,
          renderTo: 'container',
          backgroundColor: 'rgba(0,0,0,0)', //Set the chart background transparent.
          plotBorderWidth: null,
          plotShadow: false
        },
        plotOptions: {
          column: {
            borderWidth: 0
          }
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        tooltip: {
          shared: true
        },
        xAxis: {
          lineColor: '#D2EAF1',
          tickLength: 0,
          categories: chartConfig.xAxisCategories,
          labels: {
            style: {
              color: '#449DC2',
              fontWeight: 'bold',
              fontSize: '12'
            }
          }
        },
        yAxis: {
          title: '',
          tickInterval: chartConfig.tickInterval,
          gridLineColor: '#D2EAF1',
          labels: {
            style: {
              color: '#449DC2',
              fontSize: '12'
            }
          },
          plotBands: chartConfig.plotBands
        },
        series: chartConfig.series
      });
    }
  }
})();
