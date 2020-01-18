class InvoiceReport {
    constructor() {
    }

    loadReport() {
        $(".btnShowInvoiceReport").click(function() {
            console.log("LOAD InvoiceReport");
            ajaxCaller.displayReport("Invoice", "sample=sample");
        });
    }
}
