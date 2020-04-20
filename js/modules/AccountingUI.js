class AccountingUI { 
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

    selectAccountChart(obj) {
        // var recordId = $(obj).attr("recordId");
        var tabName = $(obj).attr("tabName");
        console.log(tabName);

        if (tabName=="AccountChart") {
            accountChartUI.loadAccountChartProfile(obj);
            // purchaseOrderUI.loadActivePoForProduct(obj);
        }
    }
}

