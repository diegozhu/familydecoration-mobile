/**
 ***************************** symptom tags directive *****************************
 *
 * This directive is used for symptom tags, all operations is loacted in this directive,
 * such as change css.
 *
 */
'use strict';

(function() {
  angular
    .module('fdmobile.symptomStatement')
    .directive('symptomTags', symptomTags);

  function symptomTags() {

    var allSymptomTags = [];

    /*
     * Sprint 5: user selects only one tag.
     */
    function clean(symptomCode) {
      angular.forEach(allSymptomTags, function(symptomTag) {
        if (symptomCode !== symptomTag.symptomCode) {
          var tagElement = angular.element(document.querySelector('#symptomTag-' + symptomTag.symptomCode));
          tagElement.removeClass('tagged');
          tagElement.addClass('untagged');
          symptomTag.isTagged = false;
        }
      });
    }

    function linkFn($scope, $element) {
      var symptomTag = $scope.symptomTag;

      allSymptomTags.push(symptomTag);

      $element.bind('click', function(elementObj) {
        if (symptomTag) {
          var symptomCode = symptomTag.symptomCode,
            symptomTagElement = angular.element(elementObj.target);

          if (symptomTagElement && !symptomTag.isTagged) {
            //select a tag
            symptomTagElement.removeClass('untagged');
            symptomTagElement.addClass('tagged');
            symptomTag.isTagged = true;

            //Sprint 5: user is unable to select multiple tags;
            // Due to this directive is also used in the symptom report which only allow to select one.
            if (!symptomTag.type || symptomTag.type !== 'symptom-statement') {
              clean(symptomCode);
            }
          } else {
            //unselect a tag
            symptomTagElement.removeClass('tagged');
            symptomTagElement.addClass('untagged');
            symptomTag.isTagged = false;
          }
        }
      });
    }

    return {
      restrict: 'A',
      link: linkFn
    };
  }
})();
