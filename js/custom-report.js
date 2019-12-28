class CustomReport {
    constructor() {
        console.log("CustomReport called");
        var context = this;
        $(document).on('click', '.btnCustomReportToggleCriteria', function() {
            context.customReportToggleCriteria(this);
        });
        $(document).on('click', '.btnCustomReportFullScreen', function() {
            context.customReportFullScreen(this);
        });
        $(document).on('click', '.btnCustomReportRun', function() {
            context.customReportRun(this);
        });     
        $(document).on('click', '.btnCustomDisplayModalReport', function() {
            context.customDisplayModalReport(this);
        });     
        
    }

    customDisplayModalReport(obj) {
        var moduleName = $(obj).attr("module");
        var reportName = $(obj).attr("report");
        var allSelect = `select.customReportReloadableSelect[module="${moduleName}"][report="${reportName}"]`;
        console.log(allSelect);
        console.log("reload ");
        console.log(this);
        console.log("Main ID == "+localStorage.latestModuleId);

        var iframeViewer = `iframe.customReportViewerFrame[report='${reportName}']`;
        console.log(iframeViewer);
        document.querySelector(iframeViewer).src="";

        $(allSelect).each(function(index) {
            var currentSelect = this;
            var inputName = $(this).attr("name");

            var myData = {};
            myData["action"] = "loadSelect";
            myData["report"] = reportName;
            myData["inputName"] = inputName;
            myData["recordId"] = localStorage.latestModuleId;
            
            var vdata = JSON.stringify(myData);
            console.log(vdata);
            var url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/${moduleName}/post`;
            var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
            var successCallback = function(data) {
                $(currentSelect).empty();
                console.log(data);
                $(data).each(function(ind) {
                    var optionId = this.getProp("id");
                    var optionDisplay = this.getProp("recordTitle");
                    var opt = `<option value='${optionId}'>${optionDisplay}</option>`;
                    $(currentSelect).append(opt);
                });
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback); 
            ajaxCaller.ajaxPost();                            
        });
    }

    customReportToggleCriteria(obj) {
        console.log("btnCustomReportToggleCriteria");
        var reportName = $(obj).attr("reportName");
        var myCustomReportCriteria = $(`.myCustomReportCriteria[reportName='${reportName}']`);
        if($(myCustomReportCriteria).is(":visible")){
            $(myCustomReportCriteria).hide();
        } else{
            $(myCustomReportCriteria).show();
        }
    }

    customReportFullScreen(obj) {
        console.log("customReportFullScreen");
        var reportName = $(obj).attr("report");
        var iframeViewer = `iframe.customReportViewerFrame[report='${reportName}']`;
        $(iframeViewer).fullScreen(true);
    }

    customReportRun(obj) {
        var context = this;
        console.log("customReportRun");
        var moduleName = $(obj).attr("module");
        var reportName = $(obj).attr("report");
        var reportCriteria = {};
        var reportCriteriaSelectors = `.reportCriteriaInput[module='${moduleName}'][report='${reportName}']`;
        console.log(reportCriteriaSelectors);
        $(reportCriteriaSelectors).each(function(index) {
            var name = $(this).attr("name");
            var value = $(this).val();
            reportCriteria[name] = value;
        });
        reportCriteria["recordId"] = localStorage.latestModuleId;
        console.log(reportCriteria);

        var vdata = JSON.stringify(reportCriteria);
        console.log(vdata);
        var url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/customReport/${moduleName}/${reportName}/post`;
        var ajax = new AjaxBytesLoader();
        ajax.loadPost(url, function(data_url) {
            var iframeViewer = `iframe.customReportViewerFrame[report='${reportName}']`;
            console.log(iframeViewer);
            document.querySelector(iframeViewer).src=data_url;
        }, vdata);
    }
}

$(function () {
    var customReport = new CustomReport();
});
