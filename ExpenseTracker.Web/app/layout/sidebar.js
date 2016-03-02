﻿(function () { 
    'use strict';
    
    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$location', '$state', 'bootstrap.dialog', 'config', 'datacontext', 'routes', sidebar]);

    function sidebar($location, $state, bsDialog, config, datacontext, routes) {
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.routes = routes;
        
        activate();

        function activate() {
            getNavRoutes();
               
        }
        
        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function (r1, r2) {
                return r1.config.settings.nav > r2.config.settings.nav;
            });
        }
        
        function isCurrent(route) {
            if (!route.config.title || !$state.current || !$state.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    };
})();
