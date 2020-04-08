class GlobalEventsAccounting {
    initializeGlobalEvents() {

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
