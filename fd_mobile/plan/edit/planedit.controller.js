(function() {
  'use strict';

  angular.module('fdmobile.plan.edit').controller('PlanEditController', function(planItems, $log) {
    var vm = this;

    if (planItems.data) {
      vm.planItems = planItems.data;
    }
    else {
      planItems.then(function(res) {
        vm.planItems = res.data;
      }, function(res) {
        $log.log(res.errMsg);
      });
    }
  });
})();
