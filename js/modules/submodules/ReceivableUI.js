class ReceivableUI {
    saveReceivable(obj) { 
        console.log("saveReceivable called");
        var tmp = utils.collectDataForSaving("editReceivable", "ReceivableUI", "0");
        tmp["ReceivableItems"] = utils.collectSubRecordDataForSaving("editReceivable", "ReceivableItemUI");

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReceivableUI/post/saveReceivable`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Save Receivable Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadReceivableProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReceivableUI/getReceivableProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            ReceivableUI.arrangeReceivableProfile(data, "editReceivable");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeReceivableProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, "ReceivableUI");

        $(`.editReceivable[module="ReceivableItemUI"]`).val("");
        var items = data.getProp("ReceivableItems");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "ReceivableItemUI");
        })
    }

    searchReceivableFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReceivableUI/getFilteredReceivables/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            ReceivableUI.arrangeSearchedReceivables(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopReceivables(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReceivableUI/getTopReceivables`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            ReceivableUI.arrangeSearchedReceivables(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedReceivables(data, tabName) {
        var divSelector = `.ReceivableUI_SearchReceivables[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var payeeName = obj.getProp("customerName");
            var accountName = obj.getProp("employeeName");
            var paymentDate = obj.getProp("invoiceDate");
            var totalAmount = obj.getProp("totalAmount");
            var ReceivableId = obj.getProp("ReceivableId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="ReceivableUI_selectReceivable" recordId="${ReceivableId}" module="ReceivableUI" tabName="${tabName}">${payeeName}</a></span>
                        <span class="pull-right">${accountName}</span><br/>
                    </div>
                    <div style="flex: 100%;">
                        <span><a href="#" class="ReceivableUI_selectReceivable" recordId="${ReceivableId}" module="ReceivableUI" tabName="${tabName}"><i class="fa fa-calendar"> Total: </i> ${paymentDate}</a></span>
                        <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Total: </i> ${totalAmount}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}