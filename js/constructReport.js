class MainReport {
    constructor(moduleName) {
        this.moduleName = moduleName;
        this.invoiceReport = new InvoiceReport();
    }

    construct() {
        var context = this;
        $.get( "/module/"+this.moduleName, function( result ) {
            <!--console.log(result);-->
            $("#content-main").html(result);
            context.invoiceReport.loadReport();
        });
    };
}
