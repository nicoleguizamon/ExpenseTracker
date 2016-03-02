(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'helper';

    angular.module('app').factory(serviceId, ['$location', 'common', helper]);

    function helper($location, common) {
        // Define the functions and properties to reveal.
        var service = {
            replaceLocationUrlguidWithId: replaceLocationUrlguidWithId
        };

        return service;

        function replaceLocationUrlguidWithId(id) {
            var currentPath = $location.path();
            var slashPos = currentPath.lastIndexOf('/', currentPath.length - 2);
            var currentParameter = currentPath.substring(slashPos - 1);
            if (common.isNumber(currentParameter)) { return; }

            var newPath = currentPath.substring(0, slashPos + 1) + id;
            $location.path(newPath);
        }

       
    }
})();