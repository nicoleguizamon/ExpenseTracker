(function () {
    'use strict';

    var serviceId = 'focus';
    angular.module('app').factory(serviceId, ['$rootScope', '$timeout', focus]);

    function focus($rootScope, $timeout) {
        return function(name) {
            $timeout(function() {
                $rootScope.$broadcast('focusOn', name);
            });
        };

    }


})();