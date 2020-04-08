class AccountChartUI {
    loadAccountChartProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/AccountChartUI/getAccountChartProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            accountChartUI.arrangeAccountChartProfile(data, "editAccountChart");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeAccountChartProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, "AccountChartUI");
    }

    searchAccountChartFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/AccountChartUI/getFilteredAccountCharts/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            accountChartUI.arrangeSearchedAccountCharts(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopAccountCharts(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/AccountChartUI/getTopAccountCharts`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            accountChartUI.arrangeSearchedAccountCharts(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedAccountCharts(data, tabName) {
        var divSelector = `.AccountChartUI_SearchAccountCharts[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var accountName = obj.getProp("accountName");
            var accountClass = obj.getProp("accountClass");
            var accountNature = obj.getProp("accountNature");
            var accountNumber = obj.getProp("accountNumber");
            var accountChartId = obj.getProp("accountChartId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="AccountChartUI_selectAccountChart" recordId="${accountChartId}" module="AccountChartUI" tabName="${tabName}">${accountName} - #${accountNumber}</a></span>
                        <span class="pull-right">${accountClass}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}