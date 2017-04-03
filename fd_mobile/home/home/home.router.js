(function () {
  'use strict';

  angular
    .module('fdmobile.home')
    .config(homeRouter);

  function homeRouter($stateProvider, ionicDatePickerProvider) {
    var datePickerObj = {
      // inputDate: new Date(),
      titleLabel: '选择日期',
      setLabel: '设置',
      todayLabel: '今天',
      closeLabel: '关闭',
      mondayFirst: false,
      weeksList: ['日', '一', '二', '三', '四', '五', '六'],
      monthsList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      templateType: 'popup',
      // from: new Date(2012, 8, 1),
      // to: new Date(2018, 8, 1),
      // showTodayButton: true,
      dateFormat: 'yyyy年MM月dd日',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
    $stateProvider
      .state({
        name: 'home',
        url: '/',
        abstract: true,
        templateUrl: 'home/home/home.html'
      });
  }
})();
