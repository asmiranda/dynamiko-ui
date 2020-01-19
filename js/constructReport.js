class MainReport {
    constructMainReport(moduleName) {
        var context = this;
        $.get( "/module/"+moduleName, function( result ) {
            // console.log(result);
            $("#content-main").html(result);
            invoiceReport.loadReport();
        });
    };
}

$(function () {
    mainReport = new MainReport();
});
