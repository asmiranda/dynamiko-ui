class ProcurementChartWidget {
    constructor() {
    }

    init() {
        console.log("LOAD PROCUREMENT CHART");
        if ($("#procurementChart")) {
            var cashChart = document.getElementById("procurementChart").getContext("2d");

            var ajaxRequestDTO = new AjaxRequestDTO();
            ajaxRequestDTO.url = MAIN_URL+"/api/generic/widget/ProcurementChartWidget";
            ajaxRequestDTO.data = "";

            var successFunction = function(data) {
                console.log(data);
                var rule = new WidgetChartRule();
                rule.doChart("#procurementChart", data, data.chartType);
            };

            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successFunction);
            ajaxCaller.ajaxGet();
        }
    }
}
