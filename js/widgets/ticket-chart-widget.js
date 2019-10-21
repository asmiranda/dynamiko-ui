class TicketChartWidget {
    constructor() {
    }

    init() {
        console.log("LOAD TICKET CHART");
        if ($("#ticketChart")) {
            var cashChart = document.getElementById("ticketChart").getContext("2d");

            var ajaxRequestDTO = new AjaxRequestDTO();
            ajaxRequestDTO.url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/widget/TicketChartWidget";
            ajaxRequestDTO.data = "";

            var successFunction = function(data) {
                console.log(data);
                var rule = new WidgetChartRule();
                rule.doChart("#ticketChart", data, data.chartType);
            };

            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successFunction);
            ajaxCaller.ajaxGet();
        }
    }
}
