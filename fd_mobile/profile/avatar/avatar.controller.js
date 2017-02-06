(function() {
  'use strict';

  angular.module('fdmobile.avatar').controller('AvatarController', AvatarController);
  AvatarController.$inject = [];

  function AvatarController() {
    var vm = this;
    vm.user = {
      familyName: 'Targaryen',
      middleName: '',
      lastName: 'Daenerys',
      nickName: 'stormborn',
      birthDay: new Date(),
      gender: 'Female',
      contact: 'Son'
    };
  }
})();
