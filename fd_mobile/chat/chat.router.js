(function() {
  'use strict';

  angular
    .module('fdmobile.chat')
    .config(chatRouter);

  function chatRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.chat',
        url: 'chat',
        views: {
          'tab-chat': {
            templateUrl: 'chat/conversation/conversation-list.html',
            controller: 'conversationListController as vm'
          }
        }
      })
      .state('chatBoard', {
        cache: false,
        url: '/chat/chatBoard',
        params: {
          conversationId: '',
          membersPlainText: '',
          unreadMessagesCount: 0
        },
        templateUrl: 'chat/chat-board/chat-board.html',
        controller: 'chatBoardController as vm'
      });
  }
})();
