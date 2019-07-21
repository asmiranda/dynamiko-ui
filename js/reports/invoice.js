class InvoiceReport {
    constructor() {
    }

    loadReport() {
        $(".btnShowInvoiceReport").click(function() {
            console.log("LOAD InvoiceReport");
            var ajaxReportViewer = new AjaxReportViewer();
            ajaxReportViewer.display("Invoice", "sample=sample");
        });
    }
}
