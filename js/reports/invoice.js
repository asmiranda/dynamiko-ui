class InvoiceReport {
    constructor() {
        $(document).on('click', '.btnShowInvoiceReport', function() {
            ajaxCaller.displayReport("Invoice", "sample=sample");
        });
    }

    loadReport() {
    }
}
