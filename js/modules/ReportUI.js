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
            const groups = new Set();
            $(data).each(function(index, obj) {
                var group = obj.getProp("group");
                groups.add(group);
            });
            console.log(groups);

            for (let groupName of groups) {
                console.log(groupName);
                var str = `<optgroup label="${groupName}">`;
                $(data).each(function(index, obj) {
                    var group = obj.getProp("group");
                    if (group==groupName) {
                        var name = obj.getProp("name");
                        var title = obj.getProp("title");
                        str += `<option value="${name}">${title}</option>`;
                    }
                });
                str += `</optgroup>`;
                $(divSelector).append(str);
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    displayReport(obj) {
        var divSelector = `select[module="ReportUI"][name="report"]`;
        var reportName = $(divSelector).val();
        var queryStr = "";
        $(".reportParam").each(function(index, obj) {
            var value = $(obj).val();
            if (value != "") {
                var name = $(obj).attr("name");
                queryStr += `${name}=${value}`;
            }
        });
        console.log(queryStr);
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/pwidget/ReportUI/displayReport/${reportName}/pdf?${queryStr}`;
        console.log(url);
        $("#reportFrame").attr("src", url);
    }

    changeParameters(obj) {
        console.log("changeParameters");
        var reportName = $(obj).val();
        console.log(`reportName == ${reportName}`);
        $(".reportParameters").empty();
        if (reportName!="") {
            var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReportUI/getParameters/${reportName}`;
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
    
            var successCallback = function(data) {
                console.log(data);
                $(data).each(function(index, obj) {
                    var title = obj.getProp("title");
                    var name = obj.getProp("name");
                    var type = obj.getProp("type");
                    var dropDownLst = obj.getProp("dropDownLst");
                    console.log(title, name, type, dropDownLst);
                    var str = "";
                    if (type=="STRING") {
                        str = reportUI.createStringParam(name, title);
                    }
                    else if (type=="INT") {
                        str = reportUI.createIntParam(name, title);
                    }
                    else if (type=="DOUBLE") {
                        str = reportUI.createDoubleParam(name, title);
                    }
                    else if (type=="DATE") {
                        str = reportUI.createDateParam(name, title);
                    }
                    else if (type=="DROPDOWN") {
                        str = reportUI.createDropDownParam(name, title, dropDownLst);
                    }
                    else if (type=="AUTOCOMPLETE") {
                        str = reportUI.createAutoCompleteParam(name, title);
                    }
                    $(".reportParameters").append(str);
                });
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
    }

    createAutoCompleteParam(name, title) {
        var str = `
            <div class="form-group" style="flex: 3; margin-left: 10px;">
                <label class="control-label">${title}</label>
                <div class="input-group" style="width: 100%;">
                    <input rowindex="0" type="text" class="form-control autocomplete" name="${name}" placeholder="${title}" module="ReportUI" mainmodule="ReportUI" autoname="${name}" helptitle="${name}">
                    <input rowindex="0" class="form-control reportParam HiddenAutoComplete" name="${name}" type="hidden" module="ReportUI" mainmodule="ReportUI" autonamefield="${name}" value="">
                    <div class="autocomplete-items" rowindex="0" module="ReportUI" mainmodule="ReportUI" autoname="${name}">
                    </div>
                </div>
            </div>
        `;
        return str;
    }
 
    createDropDownParam(name, title, dropDownLst) {
        var selections = "";
        $(dropDownLst).each(function(index, obj) {
            var key = obj.getProp("key");
            var value = obj.getProp("value");
            selections += `<option value="${key}">${value}</option>`;
        });
        var str = `
            <div class="form-group" style="margin-left: 15px;">
                <label>${title}</label>
                <select class="form-control reportParam" rowindex="0" module="ReportUI" name="${name}">
                    <option>--</option>
                    ${selections}
                </select>
            </div>
        `;
        return str;
    }

    createDoubleParam(name, title) {
        var str = `
            <div class="form-group" style="margin-left: 15px;">
                <label>${title}</label>
                <input type="text" rowindex="0" class="form-control reportParam" module="ReportUI" name="${name}" tabname="Report">
            </div>
        `;
        return str;
    }

    createStringParam(name, title) {
        var str = `
            <div class="form-group" style="margin-left: 15px;">
                <label>${title}</label>
                <input type="text" rowindex="0" class="form-control reportParam" module="ReportUI" name="${name}" tabname="Report">
            </div>
        `;
        return str;
    }

    createIntParam(name, title) {
        var str = `
            <div class="form-group" style="margin-left: 15px;">
                <label>${title}</label>
                <input type="text" rowindex="0" class="form-control reportParam" module="ReportUI" name="${name}" tabname="Report">
            </div>
        `;
        return str;
    }

    createDateParam(name, title) {
        var str = `
            <div class="form-group" style="margin-left: 15px;">
                <label>${title}</label>
                <input type="text" rowindex="0" class="form-control calendar reportParam" module="ReportUI" name="${name}" tabname="Report">
            </div>
        `;
        return str;
    }
}

