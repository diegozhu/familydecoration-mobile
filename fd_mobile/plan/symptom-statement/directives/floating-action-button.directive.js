/**
 ***************************** symptom tags directive *****************************
 *
 * This directive is used for symptom tags, all operations is loacted in this directive,
 * such as change css.
 *
 */
/*
 *
 * Material UI-like Floating Action Button for App.
 *
 */

'use strict';

(function() {
  angular
    .module('fdmobile.symptomStatement')
    .directive('floatingActionButton', floatingActionButton);

  function floatingActionButton() {
    return {
      restrict: 'E',
      scope: {
        click: '&?',
        buttonColor: '@?',
        buttonClass: '@?',
        icon: '@?',
        iconColor: '@?',
        hasFooter: '=?'
      },
      template: '<ul id="floating-button" ng-style="{\'bottom\': bottomValue }">' +
        '<li ng-class="buttonClass" ng-style="{\'background-color\': buttonColor }">' +
        '<a ng-click="click()"><i class="icon menu-icon" ng-class="{ \'{{icon}}\' : true}" ng-style="{\'color\': iconColor }"></i></a>' +
        '</li>' +
        '</ul>',
      replace: true,
      transclude: true,
      controller: function($scope) {
        $scope.buttonColor = $scope.buttonColor || '#f07c00';
        $scope.icon = $scope.icon || 'ion-plus';
        $scope.iconColor = $scope.iconColor || '#fff';
        $scope.hasFooter = $scope.hasFooter || false;
        if ($scope.hasFooter) {
          $scope.bottomValue = '60px';
        } else {
          $scope.bottomValue = '20px';
        }
      }
    };
  }
})();
