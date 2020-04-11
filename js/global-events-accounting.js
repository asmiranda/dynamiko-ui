class GlobalEventsAccounting {
    initializeGlobalEvents() {

        $(document).on('click', '.btnSaveBanking', function() {
            bankingUI.saveBanking(this);
        });
        $(document).on('click', '.BankingUI_selectBanking', function() {
            bankingUI.loadBankingProfile(this);
        });

        $(document).on('click', '.btnSaveExpense', function() {
            expenseUI.saveExpense(this);
        });
        $(document).on('click', '.ExpenseUI_selectExpense', function() {
            expenseUI.loadExpenseProfile(this);
        });

        $(document).on('click', '.AccountChartUI_selectAccountChart', function() {
            accountChartUI.loadAccountChartProfile(this);
        });

        $(document).on('click', '.selectEstimate', function() {
            salesOrderUI.selectEstimate(this);
        });
        $(document).on('click', '.selectSalesOrder', function() {
            salesOrderUI.selectSalesOrder(this);
        });

    }
}
