(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'expensedetail';

    angular.module('app').controller(controllerId,
        ['$location', '$stateParams', '$scope', '$window', 'config', 'bootstrap.dialog', 'common', 'helper',
            'datacontext', 'focus', expensedetail]);

    function expensedetail($location, $stateParams, $scope, $window, config, bsDialog, common,
             helper, datacontext, focus) {
        var vm = this;
        
        var $q = common.$q;
        //var entityName = model.entityNames.expense;
        var wipEntityKey = undefined;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');
        var logSuccess = getLogFn(controllerId, 'success');

        
        vm.deleteExpense = deleteExpense;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.isNew = false;
        vm.save = save;        
        vm.expense = undefined;        
        vm.activate = activate;
        vm.title = 'expensedetail';        

        focus('focusMe');
        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });
        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        function canSave() {
            return !vm.isSaving;
        }

        function canDelete() {
            return !vm.isNew;
        }

        activate();



        function activate() {            
            //onDestroy();
            
            $('#datetimepicker_start_time').datetimepicker({
                format: 'm/d/Y H:i',
                defaultDate: new Date()
            });           

            common.activateController([getRequestedExpense()], controllerId)
                .then();
        }
        

        function deleteExpense() {
            return bsDialog.deleteDialog('Expense')
                .then(confirmDelete);

            function confirmDelete() {
                var val = $stateParams.id;
                if (!$.isNumeric(val)) {
                    gotoExpenses();                    
                }
                datacontext.expense.deleteExpense(val).
                then(success, failed);

                function success() {
                    logSuccess('Deleted successfully', null, true);
                    gotoExpenses();
                }

                function failed(error) {
                    logError('Unable to get expense: ' + error.data);
                    gotoExpenses();
                }
            }
        }

        function gotoExpenses() {
            $location.path('/expenses');
        }

        function getRequestedExpense() {
            var val = $stateParams.id;
            if (val === 'new') {
                vm.hasChanges = true;
                vm.isNew = true;
                return vm.expense;
            }
            if (!$.isNumeric(val)) {
                gotoExpenses();
                return null;
            }


            return datacontext.expense.getExpenseById(val)
                .then(function (data) {
                    vm.expense = data.data || data;
                    vm.expense.expenseDate = moment(vm.expense.expenseDate).format("MM/DD/YYYY HH:mm");
            }, function (error) {
                    logError('Unable to get expense: ' + error.data);
                    gotoExpenses();
                });
        }

        function goBack() { $window.history.back(); }

        
        function validateInputs() {
            var isValid = true;            
            if (!vm.expense) {
                logError('"Description", "Expense Date", "Amount" fields are required', null, true);
                isValid = false;
            } else {
                if (!vm.expense.description) {
                    logError('Description field is required',null, true);                    
                    isValid = false;
                }
                if (!vm.expense.expenseDate) {
                    logError('Expense Date field is required', null, true);                    
                    isValid = false;
                }
                if (!vm.expense.amount) {
                    logError('Amount field is required', null, true);                    
                    isValid = false;
                }
            }                      
            return isValid;
        }        


        function onSuccessfulCommit() {
            logSuccess('Saved successfully', null, true);
            vm.isSaving = false;
            gotoExpenses();
        }

        function onFailedCommit(error) {
            vm.isSaving = false;
            var errorMessage = '';
            if (error) {
                jQuery.each(error, function (i, val) {
                    if (errorMessage != '') {
                        errorMessage = ' ';
                    }
                    errorMessage = val + '.';
                });
                logError(errorMessage, null, true);
            } else {
                logError('An unexpected error has occurred.', null, true);
            }
        }


        function save() {            
            if (validateInputs()) {
                var myExpense = {
                    Description: vm.expense.description,
                    Amount: vm.expense.amount,
                    ExpenseDate: vm.expense.expenseDate,
                    Comment: vm.expense.comment,
                    Id: vm.expense.id,
                    UserId: vm.expense.userId
                };
                vm.isSaving = true;

                if (myExpense.Id && myExpense.Id > 0) {
                    var updateResponse = datacontext.expense.updateExpense(myExpense, onSuccessfulCommit, onFailedCommit);
                    
                } else {
                    var saveResponse = datacontext.expense.saveExpense(myExpense, onSuccessfulCommit, onFailedCommit);
                }
            } 
        }
    }
})();
