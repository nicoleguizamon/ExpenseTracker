(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$stateProvider', '$urlRouterProvider', 'routes', routeConfigurator]);
    function routeConfigurator($stateProvider, $urlRouterProvider, routes) {

        prime.$inject = ['datacontext'];
        function prime(dc) { return dc.prime(); }

        routes.forEach(function (r) {
            $stateProvider.state(r.stateName, r.config);
        });
        
        $urlRouterProvider.otherwise('/');
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                stateName: 'home',
                config: {
                    templateUrl: 'app/home/home.html',
                    title: 'home',
                    url: '/',                    
                    controller: 'home',
                    settings: {
                        nav: 1,
                        content: '<i class="fa icon-home"></i> Home'
                    }
                }
            }, {
                stateName: 'expenses',
                config: {
                    title: 'expenses',
                    templateUrl: 'app/expense/expenses.html',
                    url: '/expenses',
                    resolve: {
                        user: 'userAccount',
                        authenticationRequired: function (user) {
                            user.isAuthenticated();
                        }
                    },
                    controller: 'expenses',
                    settings: {
                        nav: 2,
                        content: '<i class="fa icon-money"></i> My expenses'
                    }
                }
            }, {
                stateName: 'expense',                
                config: {
                    title: 'expense',
                    templateUrl: 'app/expense/expensedetail.html',
                    url: '/expense/:id',
                    controller: 'expensedetail',
                    resolve: {
                        user: 'userAccount',
                        authenticationRequired: function (user) {
                            user.isAuthenticated();
                        }
                    }
                }
            }, {
                stateName: 'login',                
                config: {
                    title: 'login',
                    url: '/login',
                    templateUrl: 'app/login/login.html'                    
                    
                }
            }, {
                stateName: 'register',
                config: {
                    title: 'register',
                    url: '/register',
                    templateUrl: 'app/login/register.html'

                }
            }
        ];
    }
})();