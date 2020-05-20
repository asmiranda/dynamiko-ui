class AccountingUI { 
    constructor() {
    }

    changeMainId(obj) {
    }

    doMainSearchData(evt) {
    }

    changeModule(evt) {
        personTaskUI.loadTodoList();
        employeeUI.loadTopEmployees();
        accountChartUI.loadTopAccountCharts("AccountChart");
        expenseUI.loadTopExpenses("Expense");
        salesOrderUI.loadTopSalesOrders("SalesOrder");
        bankingUI.loadTopBankings("Banking");
        taxPeriodUI.loadTopTaxPeriods("TaxPeriod");
        reconcileUI.loadTopReconciles("Reconcile");
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }
}

$(function () {
    accountingUI = new AccountingUI();

    // #################for sub modules
    accountingDashboardUI = new AccountingDashboardUI();
    bankingUI = new BankingUI();
    salesOrderUI = new SalesOrderUI();
    expenseUI = new ExpenseUI();
    receivableUI = new ReceivableUI();
    payabaleUI = new PayableUI();
    manualEntryUI = new manualEntryUI();
    taxPeriodUI = new TaxPeriodUI();
    reconcileUI = new ReconcileUI();
    accountChartUI = new AccountChartUI();
    accountingReportUI = new AccountingReportUI();
});

