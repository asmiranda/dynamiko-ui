class GovernmentCashierUI { 
    selectGovernmentCashier(obj) {
        governmentCashierUI.loadGovernmentCashierProfile(obj, "GovernmentCashier");
    }

    loadToCashierQueue() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentCashierUI/getTopCashierQueue`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            governmentCashierUI.arrangeSearchedGovernmentCashiers(data, "GovernmentCashier");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadGovernmentCashierProfile(obj, tabName) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentCashierUI/getCashierQueueProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            var moduleName = data.getProp("moduleName");
            var recordId = data.getProp("recordId");

            var cashierTakerCode = data.getProp("cashierTakerCode");
            var queueDate = data.getProp("queueDate");
            var queueNumber = data.getProp("queueNumber");
            var title = data.getProp("title");
            var invoiceNumber = data.getProp("invoiceNumber");
            var issuerName = data.getProp("issuerName");
            var totalAmount = data.getProp("totalAmount");

            $(`[module="GovernmentCashierUI"][name="cashierTakerCode"]`).val(cashierTakerCode);
            $(`[module="GovernmentCashierUI"][name="queueDate"]`).val(queueDate);
            $(`[module="GovernmentCashierUI"][name="queueNumber"]`).val(queueNumber);
            $(`[module="GovernmentCashierUI"][name="title"]`).val(title);
            $(`[module="GovernmentCashierUI"][name="invoiceNumber"]`).val(invoiceNumber);
            $(`[module="GovernmentCashierUI"][name="issuerName"]`).val(issuerName);
            $(`[module="GovernmentCashierUI"][name="totalAmount"]`).val(totalAmount);
            $(`[module="GovernmentCashierUI"][name="moduleName"]`).val(moduleName);
            $(`[module="GovernmentCashierUI"][name="recordId"]`).val(recordId);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    searchGovernmentCashierFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentCashierUI/filterGovernmentCashier/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            GovernmentCashierUI.arrangeSearchedGovernmentCashiers(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedGovernmentCashiers(data, tabName) {
        console.log(data);
        var divName = `.searchGovernmentCashiers[module="GovernmentCashierUI"][tabName="${tabName}"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var recordId = obj.getProp("CashierQueueId");
            var title = obj.getProp("title");
            var queueNumber = obj.getPropDefault("queueNumber", "");
            var queueDate = obj.getPropDefault("queueDate", "");
            var str = `
                <a href="#" class="selectGovernmentCashier" module="GovernmentCashierUI" tabName="${tabName}" recordId="${recordId}" style="font-weight: bolder;">${title}</a>
                <br/><span class="text-muted">
                    Queue #: <b style="font-size: 18px;">${queueNumber}</b> of ${queueDate}
                </span>
                <hr>
            `;
            $(divName).append(str);
            
        });
    }
}

