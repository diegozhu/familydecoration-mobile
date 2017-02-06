(function() {
  'use strict';

  angular.module('fdmobile.settingsContact').controller('SettingscontactController', SettingscontactController);

  function SettingscontactController() {
    var vm = this;
    vm.call = function(phoneNumber) {
      window.open('tel:' + phoneNumber);
    };

    vm.contacts = [
      {
        name: '蒋捷医生或刘娟主管护师',
        number: '010-83575389',
        desc: '任何与本研究、疾病相关的问题',
        time: '工作日 8:00-17:00'
      }, {
        name: '北大一临床研究伦理委员会',
        number: '010-66551211',
        desc: '任何与自身权益相关的问题',
        time: '工作日 8:00-17:00'
      }, {
        name: '飞利浦医疗中国',
        number: '4009685885',
        desc: '任何与产品使用及技术类问题',
        time: '工作日 8:00-17:00'
      }];
  }
})();
