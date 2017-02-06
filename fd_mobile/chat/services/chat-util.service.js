(function() {
  'use strict';

  angular
    .module('fdmobile.chat')
    .factory('chatUtilityService', chatUtilityService);

  function chatUtilityService() {
    // define service members
    var service = {
      composeConversation: composeConversation,
      getMembersByPlainText: getMembersByPlainText
    };
    return service;

    // =========================================

    function composeConversation(conv, owner) {
      var item = {
        id: conv.id,
        creator: conv.creator,
        members: conv.members,
        unreadMessagesCount: conv.unreadMessagesCount,
        membersPlainText: getMembersByPlainText(conv.members, owner),
        lastMessageAt: conv._lastMessageAt
      };
      return item;
    }

    function getMembersByPlainText(members, owner) {
      if (!members || members.length === 0) {
        return '';
      }
      var newArray = [];
      var j = 0;
      for (var i = 0; i < members.length; i++) {
        if (members[i] !== owner) {
          newArray[j++] = members[i];
        }
      }
      return newArray.join(' & ');
    }
  }
})();
