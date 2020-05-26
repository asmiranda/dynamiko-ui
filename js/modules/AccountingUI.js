class AccountingUI extends AbstractUI { 
    changeModule(evt) {
        // personTaskUI.loadTodoList();
        bankingUI.loadTopRecords("Banking");
        salesOrderUI.loadTopRecords("SalesOrder");
        expenseUI.loadTopRecords("Expense");
        receivableUI.loadTopRecords("Receivable");
        payableUI.loadTopRecords("Payable");
        manualEntryUI.loadTopRecords("ManualEntry");
        taxPeriodUI.loadTopRecords("TaxPeriod");
        
        // accountChartUI.loadTopAccountCharts("AccountChart");
        // reconcileUI.loadTopReconciles("Reconcile");
    }
}

$(function () {
    accountingUI = new AccountingUI();
});

