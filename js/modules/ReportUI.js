class ReportUI { 
    changeMainId(obj) {
    }

    doMainSearchData(evt) {
    }

    changeModule(evt) {
        reportUI.loadReportList();
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadReportList() {
        console.log("loadReportList");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReportUI/getReports`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);

            var divSelector = `select[module="ReportUI"][name="report"]`;
            $(divSelector).empty();
            $(data).each(function(index, obj) {
                var name = obj.getProp("name");
                var title = obj.getProp("title");
                var str = `<option value="${name}">${title}</option>`;
                $(divSelector).append(str);
            });
    
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    displayReport(obj) {
        var divSelector = `select[module="ReportUI"][name="report"]`;
        var reportName = $(divSelector).val();

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/pwidget/ReportUI/displayReport/${reportName}/pdf`;
        $("#reportFrame").attr("src", url);
    }
}

