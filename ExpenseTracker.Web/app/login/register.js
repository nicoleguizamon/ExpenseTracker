(function () {
    'use strict';
    var controllerId = 'register';
    angular.module('app').controller(controllerId, ['$scope', '$state', 'common', 'focus', 'userAccount',
        register]);

    function register($scope, $state, common, focus, userAccount) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        var vm = this;
        vm.title = 'Register';        
        $scope.errors = [];
        focus('focusMe');

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {  });
        }

        function disableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Registering...';
            }
            jQuery('#registeFormSubmitButton').prop('disabled', true).text(message);
        }

        function enableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Register';
            }
            jQuery('#registeFormSubmitButton').prop('disabled', false).text(message);
        }

        function onSuccessfulLogin() {

            log('Successfully registered');
            $state.go('login');            
        }

        function onFailedLogin(error) {
            if (error) {
                $scope.errors =error;
            }
            enableLoginButton();
        }

        $scope.register = function () {
            disableLoginButton();
            if (validateFields()) {
                userAccount.registerUser(vm.username, vm.password, vm.confirmPassword, onSuccessfulLogin, onFailedLogin);
            } else {
                enableLoginButton();
            }
            
        };

        function validateFields() {
            var isValid = true;
            if (!vm.password || !vm.confirmPassword || !vm.username) {
                isValid = false;
                logError("All fields are required.");
            }
            else if (vm.password !== vm.confirmPassword) {
                isValid = false;
                logError("Password does not match the confirm password.");
            } else if (vm.password.length < 6) {
                isValid = false;
                logError('The Password must be at least 6 characters long');
            }

            return isValid;
        }

    }
})();