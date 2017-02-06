(function() {
  'use strict';

  angular
    .module('fdmobile.conversationList')
    .controller('conversationListController', conversationListController);

  function conversationListController($scope, $state, $log, $timeout, chatClientService, chatUtilityService) {
    var vm = this;
    vm.conversationList = [];
    vm.errorMsg = '';
    vm.lastRefreshAt = new Date();
    vm.openConversation = openConversation;

    // =========================================

    getLatestConverstaion();

    function getLatestConverstaion() {
      $timeout(getLatestConverstaion, 500);
      vm.lastRefreshAt = new Date();
      vm.errorMsg = chatClientService.getErrorMsg();
      vm.conversationList = chatClientService.getConversationList();
    }

    function openConversation(id) {
      if (!chatClientService.getClientStatus()) {
        return;
      }
      var membersText = '';
      var unreadMessagesCount = 0;
      for (var i = vm.conversationList.length - 1; i >= 0; i--) {
        var curConv = vm.conversationList[i];
        if (curConv.id === id) {
          membersText = chatUtilityService.getMembersByPlainText(curConv.members, chatClientService.getClientId());
          unreadMessagesCount = curConv.unreadMessagesCount;
        }
      }
      $state.go('chatBoard', {
        conversationId: id,
        membersPlainText: membersText,
        unreadMessagesCount: unreadMessagesCount
      });
    }
  }
})();
