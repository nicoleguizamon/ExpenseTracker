'use strict';

angular.module('app')
  .controller('logout', ['$state', 'userAccount', function ($state, userAccount) {
      userAccount.removeAuthentication();
      $state.go('admin');
  }]);