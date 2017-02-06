(function() {
  'use strict';

  angular
    .module('fdmobile.intake')
    .controller('IntakeController', IntakeController);

  function IntakeController($scope, $ionicModal, CONSTANT, intakeService, $translate) {
    var vm = this,
      modals = [{
        name: 'intake',
        url: 'my-data/intake/modal/intake.modal.html'
      }, {
        name: 'legend',
        url: 'my-data/intake/modal/legend.modal.html'
      }];

    angular.extend(vm, {
      templateScope: $scope,
      showLegend: showLegend,
      openModal: openModal,
      closeModal: closeModal,
      cellModifier: cellModifier,
      takenDataCache: {}
    });

    init();

    function init() {
      $scope.weekDays = [
        $translate.instant('COMMON_WEEKDAYS_SUNDAY'),
        $translate.instant('COMMON_WEEKDAYS_MONDAY'),
        $translate.instant('COMMON_WEEKDAYS_TUESDAY'),
        $translate.instant('COMMON_WEEKDAYS_WEDNESDAY'),
        $translate.instant('COMMON_WEEKDAYS_THURSDAY'),
        $translate.instant('COMMON_WEEKDAYS_FRIDAY'),
        $translate.instant('COMMON_WEEKDAYS_SATURDAY')
      ];

      $scope.showDetails = function(date, cls) {
        if (cls !== 'not-in-month' && cls !== 'future') {
          intakeService.getDetails({
            date: date.toDate()
          }).$promise.then(function(response) {
            vm.modalData = {
              date: date.format($translate.instant('INTAKE_DATE_FORMAT')),
              sessions: response.data
            };
            vm.openModal('intake');
          });
        }
      };
      $scope.$watch('vm.viewDate', getIntake);

      modals.forEach(function(modal) {
        $ionicModal.fromTemplateUrl(modal.url, {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(res) {
          vm[modal.name + 'Modal'] = res;
        });
      });

      vm.calendarView = 'month';
      vm.events = [];
      vm.viewDate = CONSTANT.TODAY;
    }

    function getIntake() {
      var date = vm.viewDate,
        year = date.getFullYear(),
        month = date.getMonth(),
        startDate,
        endDate;

      if (year === CONSTANT.TODAY.getFullYear() && month === CONSTANT.TODAY.getMonth()) {
        startDate = new Date(year, month);
        endDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
      } else {
        startDate = new Date(year, month);
        endDate = new Date(year, month, new Date(year, month + 1, 0).getDate());
      }

      intakeService.save({
        startDate: startDate,
        endDate: endDate
      }).$promise.then(function(response) {
        var data = response.data;

        for (var i = 0; i < data.length; i++) {
          var item = data[i],
            local = item.localDate;

          if (local) {
            vm.takenDataCache[local.year + '-' + local.monthValue + '-' + local.dayOfMonth] = item.intakeStatus;
          }
        }

        $scope.$broadcast('calendar.refreshView');
      });
    }

    function cellModifier(cell) {
      var date = cell.date,
        tag = date.year() + '-' + (date.month() + 1) + '-' + date.date(),
        data = vm.takenDataCache[tag];

      if (cell.inMonth) {
        cell.cssClass = data ? data : 'future';
      } else {
        cell.cssClass = 'not-in-month';
      }
    }

    function openModal(name) {
      vm[name + 'Modal'].show();
    }

    function closeModal(name) {
      vm[name + 'Modal'].hide();
    }

    function showLegend() {
      openModal('legend');
    }
  }
})();
