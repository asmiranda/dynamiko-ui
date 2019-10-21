class PerformanceGraphWidget {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }

    loadData() {
        console.log("LOAD PERFORMANCE GRAPH");
        if ($("#cashChart").attr("id")) {
            var cashChart = document.getElementById("performanceGraph").getContext("2d");
            var myChart = new Chart(cashChart);

            var ajaxRequestDTO = new AjaxRequestDTO();
            ajaxRequestDTO.url = "/api/generic/"+localStorage.companyCode+"/widget/PerformanceGraphWidget";
            ajaxRequestDTO.data = "";

            var successFunction = function(data) {
                myChart.Pie(data);
                console.log(myChart);
                console.log("Complete Called.");
            };

            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successFunction);
            ajaxCaller.ajaxGet();
        }
    }
}
