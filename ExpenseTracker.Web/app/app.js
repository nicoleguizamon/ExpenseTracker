(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions
        'ui.router',
        'ngCookies',
        'ngResource',
        
        // 3rd Party Modules                
        'ui.bootstrap'      // ui-bootstrap (ex: carousel, pagination, dialog)
        
    ]);
    
    // Handle routing errors and success events
    app.run(['$rootScope', '$state', '$q', 'datacontext', 'userAccount',
        function ($rootScope, $state, $q, datacontext, userAccount) {
                        
        try {
            userAccount.isAuthenticated();
        } catch (e) {
            // do nothing with this error
        }
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error.name === 'AuthenticationRequired') {
                userAccount.setNextState(toState.name, 'You must login to access this page.');
                $state.go('login', {}, { reload: true });
            }
        });
        }]);        
})();