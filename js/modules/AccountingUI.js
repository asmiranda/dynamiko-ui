class AccountingUI extends AbstractUI { 
    changeModule(evt) {
        // personTaskUI.loadTodoList();
        bankingUI.loadTopRecords("Banking");
        salesOrderUI.loadTopRecords("SalesOrder");
        expenseUI.loadTopRecords("Expense");
        receivableUI.loadTopRecords("Receivable");
        payableUI.loadTopRecords("Payable");
        manualEntryUI.loadTopRecords("ManualEntry");
        
        // accountChartUI.loadTopAccountCharts("AccountChart");
        // taxPeriodUI.loadTopTaxPeriods("TaxPeriod");
        // reconcileUI.loadTopReconciles("Reconcile");
    }
}

$(function () {
    accountingUI = new AccountingUI();
});

