(function () {
    'use strict';
    var serviceId = 'repository.abstract';

    angular.module('app').factory(serviceId, ['common', 'config', AbstractRepository]);

    function AbstractRepository(common, config) {
        
        function Ctor() {
            this.isLoaded = false;
        }

        Ctor.extend = function (repoCtor) {
            repoCtor.prototype = new Ctor();
            repoCtor.prototype.constructor = repoCtor;
        };

        //shared by repository classes        
        Ctor.prototype.log = common.logger.getLogFn(this.serviceId);
        Ctor.prototype.$q = common.$q;

        return Ctor;
    }

})();