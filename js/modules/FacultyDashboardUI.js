class FacultyDashboardUI extends AbstractUI {
    changeMainId(obj) {
    }

    doMainSearchData(evt) {
    }

    changeModule(evt) {
        personTaskUI.loadTodoList();
        // employeeUI.loadTopEmployees();
        // accountChartUI.loadTopAccountCharts("AccountChart");
        // expenseUI.loadTopExpenses("Expense");
        // salesOrderUI.loadTopSalesOrders("SalesOrder");
        // bankingUI.loadTopBankings("Banking");
        // taxPeriodUI.loadTopTaxPeriods("TaxPeriod");
        // reconcileUI.loadTopReconciles("Reconcile");
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadedCallback(data) {
        var context = this;

        console.log("loadedCallback not implemented.")
        personTaskUI.loadTodoList();
        // this.loadFacultyHost(data);
        // this.loadActivities(data);
        // this.loadAnnouncements(data);
        // this.loadStudents(data);
    }
}

$(function () {
    facultyDashboardUI = new FacultyDashboardUI();
});
