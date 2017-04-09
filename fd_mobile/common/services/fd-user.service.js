(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('$fdUser', fdUser);

  function fdUser() {
    var
      userSvc = {},
      _role = [
        {
          name: '总经理',
          value: '001-001'
        },
        {
          name: '副总经理',
          value: '001-002'
        },
        {
          name: '设计部主管',
          value: '002-001'
        },
        {
          name: '设计师',
          value: '002-002'
        },
        {
          name: '工程部主管',
          value: '003-001'
        },
        {
          name: '项目经理',
          value: '003-002'
        },
        {
          name: '监理',
          value: '003-003'
        },
        {
          name: '市场部主管',
          value: '004-001'
        },
        {
          name: '业务员',
          value: '004-002'
        },
        {
          name: '见习业务员',
          value: '004-003'
        },
        {
          name: '人事行政部主管',
          value: '005-001'
        },
        {
          name: '人事行政部员工',
          value: '005-002'
        },
        {
          name: '游客',
          value: '006-001'
        },
        {
          name: '宣传部主管',
          value: '007-001'
        },
        {
          name: '宣传部员工',
          value: '007-002'
        },
        {
          name: '财务部主管',
          value: '008-001'
        },
        {
          name: '财务部会计',
          value: '008-002'
        },
        {
          name: '财务部出纳',
          value: '008-003'
        },
        {
          name: '财务部预算员',
          value: '008-004'
        },
        {
          name: '财务部采购',
          value: '008-005'
        },
        {
          name: '预决算主管',
          value: '009-001'
        },
        {
          name: '预决算员工',
          value: '009-002'
        }
      ];

    angular.extend(userSvc, {
      isAdmin: function(level) {
        return level === '001-001' || level === '001-002';
      },

      isManager: function(level) {
        var flag = false;
        if (/^001-\d{3}$/i.test(level)) {
          // admin
          flag = false;
        }
        else if (/^00[2345789]-001$/.test(level)) {
          // manager
          flag = true;
        }
        return flag;
      },

      isDesignManager: function(level) {
        return level === '002-001';
      },

      isProjectManager: function(level) {
        return level === '003-001';
      },

      isBusinessManager: function(level) {
        return level === '004-001';
      },

      isAdministrationManager: function(level) {
        return level === '005-001';
      },

      isSupervisor: function(level) {
        return level === '003-003';
      },

      isDesignStaff: function(level) {
        return level === '002-002';
      },

      isProjectStaff: function(level) {
        return level === '003-002';
      },

      isBusinessStaff: function(level) {
        return level === '004-002';
      },

      isAdministrationStaff: function(level) {
        return level === '005-002';
      },

      isGeneral: function(level) {
        return level === '006-001';
      },

      isPropagandaManager: function(level) {
        return level === '007-001';
      },

      isPropagandaStaff: function(level) {
        return level === '007-002';
      },

      isFinanceManager: function(level) {
        return level === '008-001';
      },

      isFinanceStaff: function(level) {
        return (level === '008-002' || level === '008-003' || level === '008-004' || level === '008-005');
      },

      isFinanceAccountant: function(level) {
        return level === '008-002';
      },

      isFinanceCashier: function(level) {
        return level === '008-003';
      },

      isBudgetManager: function(level) {
        return level === '009-001';
      },

      isBudgetStaff: function(level) {
        return level === '009-002';
      },
      getTitle: function(level) {
        var
          title,
          keepGoing = true;
        angular.forEach(_role, function(rec) {
          if (keepGoing && level === rec.value) {
            title = rec.name;
            keepGoing = false;
          }
        });
        return (title ? title : '未知');
      }
    });
    return userSvc;
  }
})();
