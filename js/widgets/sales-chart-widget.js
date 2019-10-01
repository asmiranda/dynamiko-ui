class SalesChartWidget {
    constructor() {
    }

    init() {
        console.log("LOAD SALES CHART");
        if ($("#salesChart")) {
            var cashChart = document.getElementById("salesChart").getContext("2d");

            var ajaxRequestDTO = new AjaxRequestDTO();
            ajaxRequestDTO.url = MAIN_URL+"/api/generic/widget/SalesChartWidget";
            ajaxRequestDTO.data = "";

            var successFunction = function(data) {
                console.log(data);
                var rule = new WidgetChartRule();
                rule.doChart("#salesChart", data, data.chartType);
            };

            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successFunction);
            ajaxCaller.ajaxGet();
        }
    }
}
