(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['$rootScope', 'common', 'config', 'repositories',
        datacontext]);

    function datacontext($rootScope, common, config, repositories) {
        var $q = common.$q;
        var events = config.events;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var primePromise;
        var repoNames = ['expense'];
        

        var service = {
            getRequirements: getRequirements,            
        };

        init();
        return service;

        function init() {                      
            defineLazyLoadedRepos();            
        }

        function defineLazyLoadedRepos() {
            repoNames.forEach(function (name) {
                Object.defineProperty(service, name, {
                    configurable: true,
                    get: function () {
                        var repo = repositories.getRepo(name);
                        Object.defineProperty(service, name, {
                            value: repo,
                            configurable: false,
                            enumerable: true
                        });
                        return repo;
                    }
                });
            });
        }

        function getRequirements() {
            var requirements = [
                { description: '- User must be able to create an account and log in.' },
                { description: '- app should persist to some external backend.' },
                { description: '- When logged in, user can see and edit expenses he entered.' },
                { description: '- When entered, each expense has Date, Time, Description, Amount, Comment.' },
                { description: '- User can filter expenses.' },
                { description: '- User can print expenses per week with total amount, and average day spending.' },
                { description: '- Minimal UI/UX design is needed.' },
                { description: '- REST API for all entities. You can build your own backend for this or use Parse.com-like services.' },
                { description: '- Every client operation should be done using JavaScript, reloading the page is not an option.' },
                { description: '- You need to login to the application to enter expenses.' },
                { description: '- As complementary to the last item, one should be able to create users in the system via an interface, probably a signup/register screen.' },
                { description: '- hosting is a bonus.' }                
            ];
            return $q.when(requirements);
        }
    }
})();