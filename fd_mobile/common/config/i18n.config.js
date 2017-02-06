(function() {
  'use strict';

  angular
    .module('fdmobile')
    .config(i18n);

  function i18n($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: 'assets/i18n/common/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/symptom-statement/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/security/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/home/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/coach/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/measurement/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/care-plan/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/my-data/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/profile/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/settings/locale-',
        suffix: '.json'
      }, {
        prefix: 'assets/i18n/nutrition/locale-',
        suffix: '.json'
      }
      ]
    })
    .preferredLanguage('zh')
    .useSanitizeValueStrategy('escapeParameters');
  }
})();
