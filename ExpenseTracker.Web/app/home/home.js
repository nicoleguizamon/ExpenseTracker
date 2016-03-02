(function () {
    'use strict';
    var controllerId = 'home';
    angular.module('app').controller(controllerId, ['common', 'datacontext', home]);

    function home(common, datacontext) {

        var vm = this;
        vm.requirements = [];
        
        activate();

        function activate() {
            var promises = [getRequirements()];
            common.activateController(promises, controllerId)
                .then(function () {  });
        }

       function getRequirements() {
            return datacontext.getRequirements().then(function (data) {
                return vm.requirements = data;
            });
        }
    }
})();