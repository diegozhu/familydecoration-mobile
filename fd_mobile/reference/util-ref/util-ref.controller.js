(function() {
  'use strict';

  angular
    .module('fdmobile.reference.utilRef')
    .controller('UtilRefController', UtilRefController);

  function UtilRefController($fdPopup, $fdToast) {
    var vm = this;

    angular.extend(vm, {
      date: new Date('2016/10/1'),
      minDate: new Date('2016/10/1'),
      maxDate: new Date('2016/10/7'),
      time: new Date(new Date().setHours(10, 10)),
      minTime: new Date().setHours(8),
      maxTime: new Date().setHours(12),

      showAlert: showAlert,
      showPopup: showPopup,
      showToast: showToast,
      sayhi: sayhi
    });

    function showAlert() {
      $fdPopup.alert({
        /**
         * title: '', // The title of the popup.
         * subTitle: '', // The sub-title of the popup.
         * template: '', // The html template to place in the popup body.
         * templateUrl: '', // The URL of an html template to place in the popup body.
         * okText: '', // The text of the OK button.
         * okType: '', // The type of the OK button.
         */
        title: 'Alert',
        template: 'You\'ve been warned!'
      });
    }

    function showPopup() {
      $fdPopup.show({
        /**
         * title: '', // The title of the popup.
         * iconClass: '', // The custom CSS class name
         * subTitle: '', // The sub-title of the popup.
         * template: '', // The html template to place in the popup body.
         * templateUrl: '', // The URL of an html template to place in the popup body.
         * scope: null, // A scope to link to the popup content.
         * buttons: [{ // Buttons to place in the popup footer.
         *   text: 'Cancel',
         *   type: 'button-default',
         *   onTap: function(e) {
         *     e.preventDefault(); // this will stop the popup from closing when tapped.
         *   }
         * }, {
         *   text: 'OK',
         *   type: 'button-positive',
         *   onTap: function(e) {
         *     return scope.data.response; // Returning a value will cause the promise to resolve with the given value.
         *   }
         * }]
        */
        iconClass: 'ion-star',
        title: 'Popup',
        subTitle: 'This is a popup',
        template: 'This is a popup.',
        buttons: [{
          text: 'OK',
          type: 'button-positive'
        }, {
          text: 'Cancel',
          type: 'button-stable'
        }]
      });
    }

    function showToast() {
      $fdToast.show({
        /**
         * text: '', // Content of the toast message.
         * cssClass: '', // Class name to be added on toast message.
         * dismissOnTimeout: true, // Allows toast messages to be removed automatically after a specified time.
         * timeout: 3000, // Wait time for removal of created toast message.
         * dismissOnClick: true // Allows toasts messages to be removed on mouse click.
        */
        text: 'Content of the toast message.'
      });
    }

    function sayhi() {
      alert('hi');
    }
  }
})();
