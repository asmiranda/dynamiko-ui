class AccountingUI extends AbstractUI { 
    changeModule(evt) {
        // personTaskUI.loadTodoList();
        bankingUI.loadTopRecords("Banking");
        salesOrderUI.loadTopRecords("SalesOrder");
        expenseUI.loadTopRecords("Expense");
        // receivableUI.loadTopReceivables("Receivable");
        // payableUI.loadTopPayable("Payable");

        // employeeUI.loadTopEmployees();
        // accountChartUI.loadTopAccountCharts("AccountChart");
        // taxPeriodUI.loadTopTaxPeriods("TaxPeriod");
        // reconcileUI.loadTopReconciles("Reconcile");
    }
}

$(function () {
    accountingUI = new AccountingUI();
});

