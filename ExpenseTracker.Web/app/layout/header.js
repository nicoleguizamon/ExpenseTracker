'use strict';

angular.module('app')
  .controller('header', ['$scope', '$state', 'userAccount', function ($scope, $state, userAccount) {
      $scope.user = userAccount.getUserData();

      var vm = this;
      vm.logOut = logOut;

      function logOut() {
          userAccount.removeAuthentication();
          $state.go('home');
    }
  }]);