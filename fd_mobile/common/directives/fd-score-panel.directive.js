(function() {
  'use strict';

  angular
    .module('fdmobile')
    .directive('fdScorePanel', fdScorePanel);

  fdScorePanel.$inject = [];

  function fdScorePanel() {
    return {
      replace: true,
      restrict: 'E',
      scope: {
        currentScore: '=',
        dogStatus: '=',
        clickScore: '='
      },
      template:
        '<div class="score-panel">' +
          '<div class="score-circle" ng-click="clickScore()">' +
            '<div class="score" counter value="startScore" to="currentScore" duration="1000">{{currentScore === 0 ? 0 : startScore | number:0 }}</div>' +
            '<round-progress max="100" current="currentScore" duration="1500" color="#4473A2" bgcolor="#C8E0EA" radius="42" ' +
              'stroke="7" semi="false" rounded="false" clockwise="true" responsive="false" ' +
              'animation="easeInOutCirc" animation-delay="0"></round-progress>' +
          '</div>' +
          '<div class="dog-status">' +
            '<img src="assets/images/dog-status/{{dogStatus}}/1-small.png"/>' +
          '</div>' +
        '</div>'
    };
  }
})();
