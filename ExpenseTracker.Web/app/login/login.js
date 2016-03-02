(function () {
    'use strict';
    var controllerId = 'login';
    angular.module('app').controller(controllerId, ['$scope', '$state', 'userAccount', 'focus',login]);

    function login($scope, $state, userAccount, focus) {
        $scope.username = '';
        $scope.password = '';
        $scope.persist = false;
        $scope.errors = [];
        var vm = this;
        vm.title = 'Sign in';
        var nextState = null;
        focus('focusMe');
        try {
            nextState = userAccount.getNextState();
        } catch (e) {
            nextState = null;
        }

        if (nextState !== null) {
            var nameBuffer = nextState.name + '';
            var errorBuffer = nextState.error + '';
            userAccount.clearNextState();
            nextState = {
                name: nameBuffer,
                error: errorBuffer
            };
            if (typeof nextState.error === 'string' && nextState.error !== '' && $scope.errors.indexOf(nextState.error) === -1) {
                $scope.errors.push(nextState.error);
            } else {
                $scope.errors.push('You must be logged in to view this page');
            }
        }

        function disableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Attempting login...';
            }
            jQuery('#login-form-submit-button').prop('disabled', true).text(message);
        }

        function enableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Sign in';
            }
            jQuery('#login-form-submit-button').prop('disabled', false).text(message);
        }

        function onSuccessfulLogin() {
            if (nextState !== null && typeof nextState.name === 'string' && nextState.name !== '') {
                $state.go(nextState.name, nextState.params);
            } else {
                $state.go('home');
            }
        }

        function onFailedLogin(error) {
            if (typeof error === 'string' && $scope.errors.indexOf(error) === -1) {
                $scope.errors.push(error);
            }
            enableLoginButton();
        }

        $scope.login = function () {
            disableLoginButton();
            userAccount.authenticate($scope.username, $scope.password, onSuccessfulLogin, onFailedLogin, $scope.persist);
        };
    }
})();

