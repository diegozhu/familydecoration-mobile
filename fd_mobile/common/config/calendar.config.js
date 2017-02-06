(function() {
  'use strict';

  angular
    .module('fdmobile')
    .config(calendarConfig);

  function calendarConfig(calendarConfig) {
    calendarConfig.templates.calendarMonthView = 'common/templates/calendar-month-view.html';
    calendarConfig.templates.calendarMonthCell = 'common/templates/calendar-month-cell.html';
  }
})();
