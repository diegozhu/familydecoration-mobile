 angular.module('fdmobile.nutrition')
  .directive('hcPieChart', function() {
    return {
      restrict: 'E',
      template: '<div></div>',
      scope: {
        title: '@',
        data: '='
      },
      link: function(scope, element) {
        var Highcharts = window.Highcharts;
        Highcharts.chart(element[0], {
          chart: {
            renderTo: 'chart',
            type: 'pie',
          },
          credits: {
            enabled: false
          },
          title: {
            text: '',
          },
          plotOptions: {
            pie: {
              borderWidth: 0,
              size: 100,
              innerSize: '60'
            },
          },
          colors: [
            '#b3bf4a',
            '#78c2ba',
            '#7ea4ce'
          ],
          tooltip: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          series: [{
            data: scope.data,
            size: '100%',
            innerSize: '60%',
            showInLegend: false,
            dataLabels: {
              distance: -1,
              enabled: true,
              formatter: function() {
                return this.y + '%';
              },
              style: {
                color: '#fff'
              }
            }
          }]
        });
      }
    };
  });
