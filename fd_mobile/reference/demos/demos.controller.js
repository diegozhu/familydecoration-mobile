(function() {
  'use strict';

  angular
    .module('fdmobile.reference.demos')
    .controller('DemosController', DemosController);

  function DemosController(CONSTANT, $cordovaLocalNotification, $filter) {
    var vm = this;

    angular.extend(vm, {
      at: CONSTANT.TODAY,
      task: {},

      generateTask: generateTask,
      schedule: schedule,
      cancel: cancel
    });

    function generateTask() {
      var timeset = vm.at.split(':');

      vm.task = {
        id: vm.notificationId,
        title: 'This is title ' + $filter('date')(vm.at, 'HH:mm:ss:sss'),
        text: 'This is text ' + $filter('date')(vm.at, 'HH:mm:ss:sss'),
        at: CONSTANT.TODAY.setHours(timeset[0], timeset[1], timeset[2]),
        every: CONSTANT.IS_ANDROID ? vm.every : 'minute',
        sound: 'file://assets/sounds/tune.mp3',
        data: {'notificationData': 'This is notification data.'}
      };
    }

    function schedule() {
      $cordovaLocalNotification.isPresent(vm.notificationId).then(function(present) {
        if (!present) {
          $cordovaLocalNotification.schedule(vm.task).then(function() {
            alert('set.');
          });
        }
      });
    }

    function cancel() {
      $cordovaLocalNotification.isPresent(vm.cancelId).then(function(present) {
        if (present) {
          $cordovaLocalNotification.cancel(vm.cancelId).then(function() {
            alert('cancelled.');
          });
        }
      });
    }
  }
})();
