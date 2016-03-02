(function () {
    'use strict';
    var serviceId = 'repository.expense';

    angular.module('app').factory(serviceId, ['$http', 'config','repository.abstract', RepositoryExpense]);

    function RepositoryExpense($http, config, AbstractRepository) {
        var serviceName = config.remoteServiceName;


        function Ctor() {
            this.serviceId = serviceId;
            this.getAll = getAll;            
            this.saveExpense = saveExpense;
            this.updateExpense = updateExpense;
            this.getPagedExpenses = getPagedExpenses;
            this.getExpenseById = getExpenseById;
            this.deleteExpense = deleteExpense;
            this.reportExpense = reportExpense;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function reportExpense() {
            var request = {
                method: 'POST',
                url: serviceName + 'api/Expenses/PdfReport',
                headers: { 'Content-Type': 'application/json' },
                data: ''
            };

            return $http(request);
        }

        function deleteExpense(val) {
            var request = {
                method: 'DELETE',
                url: serviceName + 'api/Expenses/' + val
            };
            return $http(request);
        }

        function saveExpense(newExpense, successCallback, errorCallback) {
            var request = {
                method: "POST",
                url: serviceName + 'api/expenses',
                headers: { 'Content-Type': 'application/json' },
                data: newExpense
            };
            var errors = [];
            return $http.post(request.url, request.data, { headers: { 'Content-Type': 'application/json' } }).then(success, failed);
            
            
            function success(data) {
                if (typeof successCallback === 'function') {
                    successCallback();
                }
            }
            function failed(data) {
                if (typeof errorCallback === 'function') {
                    if (data.statusText) {
                        errors = parseErrors(data.data);
                        errorCallback(errors);
                    } 
                }
            }            
        }

        function updateExpense(newExpense, successCallback, errorCallback) {
            var request = {
                method: "PUT",
                url: serviceName + 'api/expenses/' + newExpense.Id,                
                data: newExpense
            };
            var errors = [];
            return $http.put(request.url, request.data, { headers: { 'Content-Type': 'application/json' } }).then(success, failed);
            function success(data) {
                if (typeof successCallback === 'function') {
                    successCallback();
                }
            }
            function failed(data) {
                if (typeof errorCallback === 'function') {
                    if (data.statusText) {
                        errors = parseErrors(data.data);
                        errorCallback(errors);
                    }
                }
            }                        
        }

        function getExpenseById(val) {
            var request = {
                method: 'GET',
                url: serviceName + 'api/Expenses/' + val
                };
            return $http(request);
        }

        function getPagedExpenses(page, size, allExpenses) {            
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if (allExpenses) {
                return getByPage(allExpenses);
            }
            
            return allExpenses;
            
            function getByPage(expensesFiltered) {
                return expensesFiltered.slice(skip,skip + take);
            }            
        }


        function getAll() {            
            var request = {
                method: 'GET',
                url: serviceName + 'api/Expenses'
            };
            return $http(request);            
        }



        function parseErrors(response) {
            var errorList = [];
            for (var key in response.modelState) {
                for (var i = 0; i < response.modelState[key].length; i++) {
                    if (key == 'expense.Amount') {
                        errorList.push('The Amount has an invalid format');
                    } else if (key == 'expense.ExpenseDate') {
                        errorList.push('The Expense Date has an invalid format');
                    } else {
                        errorList.push(response.modelState[key][i]);
                    }
                }
            }
            return errorList;
        }
    }
})();