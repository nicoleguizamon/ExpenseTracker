(function () {
    'use strict';
    var controllerId = 'expenses';
    angular.module('app').controller(controllerId, ['$scope', '$timeout', '$location', 'common', 'config', 'bootstrap.dialog', 'datacontext', expenses]);

    function expenses($scope, $timeout, $location, common, config, bsDialog, datacontext) {

        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');
        var logSuccess = getLogFn(controllerId, 'success');

        var keyCodes = config.keyCodes;
        var $q = common.$q;
        //var wipEntityKey = undefined;

        $scope.Math = window.Math;
        vm.filteredExpenses = [];
        vm.filteredAndPagedExpenses = [];
        vm.predicate = '';
        vm.reverse = false;
        vm.expenseSearch = '';
        vm.gotoExpense = gotoExpense;
        vm.search = search;
        vm.refresh = refresh;
        //vm.deleteExpense = deleteExpense;
        vm.save = save;
        vm.expenses = [];
        vm.title = 'My Expenses';
        vm.hasChanges = false;
        vm.isSaving = false;        
        vm.setSort = setSort;
        vm.printReport = printReport;
        
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };

        vm.expensesInReport = [];
        vm.expenseFilteredCount = 0;
        vm.expenseCount = 0;

        activate();

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                if (vm.filteredExpenses.length == 0) {
                    return 1;
                }
                if (vm.filteredExpenses.length % vm.paging.pageSize == 0) {
                    return Math.floor(vm.filteredExpenses.length / vm.paging.pageSize);
                }
                return Math.floor(vm.filteredExpenses.length / vm.paging.pageSize) + 1;
            }
        });

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        function activate() {
            var promises = [getExpenses()];
            common.activateController(promises, controllerId)
                .then(function () { vm.showSplash = true; });
        }        

        function canSave() { return vm.hasChanges && !vm.isSaving; }

        //function deleteExpense(expense) {
        //    event.stopPropagation();
        //    return bsDialog.deleteDialog('Expense')
        //        .then(confirmDeleteSession);

        //    function confirmDeleteSession() {
        //        wipEntityKey = expense.id;
        //        datacontext.markDeleted(expense);
        //        vm.save().then(success, failed);

        //        function success() {
        //            removeWipEntity();
        //        }

        //        function failed(error) { cancel(); }
        //    }
        //}

        
        function getExpenses() {            
            return datacontext.expense.getAll()
                .then(function (data) {

                    vm.expenses = data.data;
                    applyFilter();
                    getExpensesPerPage();
                    
                    return data;
                });                      
        }

        function getExpensesPerPage() {
            var dataPerPage = datacontext.expense.getPagedExpenses(vm.paging.currentPage,
                    vm.paging.pageSize, vm.filteredExpenses);
            vm.filteredAndPagedExpenses = dataPerPage;
        }

        function gotoExpense(expense) {
            if (expense && expense.id) {
                $location.path('/expense/' + expense.id);

            }
        }

        function refresh() {
            getExpenses();
            log('Data retrieved from the server');
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getExpensesPerPage();
        }

        function save() {
            if (!vm.canSave) { return $q.when(null); }

            vm.isSaving = true;
            return datacontext.save()
                .then(function (saveResult) {
                    vm.isSaving = false;                    
                    removeWipEntity();
                }, function (error) {
                    vm.isSaving = false;
                });

        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.speakerSearch = '';
            }
            applyFilter();
        }

        function applyFilter() {
            vm.filteredExpenses = vm.expenses.filter(expenseFilter);
            getExpensesPerPage();
        }

        function expenseFilter(expense) {
            var isMatch = vm.expenseSearch ? common.textContains(expense.description, vm.expenseSearch)
                : true;
            return isMatch;
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;            
        }

        function buildReport() {
            $timeout(function () {
                var doc = new jsPDF();

                doc.setFontSize(20);
                doc.setFont("times");
                doc.setFontType("bold");
                doc.setTextColor(0);
                doc.text(30, 20, 'Weekly Expense Report');

                var elementHandlers = {
                    '#editor': function (element, renderer) {
                        return true;
                    }
                };

                doc.fromHTML($('#printExpenseReport').get(0), 30, 15, {
                    'width': 190,
                    'elementHandlers': elementHandlers
                });

                doc.save('WeeklyReport.pdf');

                log('Generating report.');
            });
        }

        function printReport() {
            var response = datacontext.expense.reportExpense()
                .success(function (data, status, headers, config) {
                    vm.expensesInReport = data;
                    buildReport();
                })
                .error(function (data, status, headers, config) {
                    logError('Unable to generate the report.');
                });
        }
    }
})();