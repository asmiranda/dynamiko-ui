class SalesOrderUI {
    saveSalesOrder(obj) {
        console.log("saveSalesOrder called");
        var tmp = utils.collectDataForSaving("editSalesOrder", "SalesOrderUI", "0");
        tmp["SalesOrderItems"] = utils.collectSubRecordDataForSaving("editSalesOrder", "SalesOrderItemUI");
        tmp["SalesOrderCategoryItems"] = utils.collectSubRecordDataForSaving("editSalesOrder", "SalesOrderCategoryItemUI");

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/post/saveSalesOrder`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Save SalesOrder Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadSalesOrderProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/getSalesOrderProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            salesOrderUI.arrangeSalesOrderProfile(data, "editSalesOrder");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeSalesOrderProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, "SalesOrderUI");

        $(`.editSalesOrder[module="SalesOrderCategoryItemUI"]`).val("");
        var items = data.getProp("SalesOrderCategoryItems");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "SalesOrderCategoryItemUI");
        })

        $(`.editSalesOrder[module="SalesOrderItemUI"]`).val("");
        var items = data.getProp("SalesOrderItems");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "SalesOrderItemUI");
        })
    }

    searchSalesOrderFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/getFilteredSalesOrders/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            salesOrderUI.arrangeSearchedSalesOrders(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopSalesOrders(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/getTopSalesOrders`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            salesOrderUI.arrangeSearchedSalesOrders(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedSalesOrders(data, tabName) {
        var divSelector = `.SalesOrderUI_SearchSalesOrders[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var payeeName = obj.getProp("payeeName");
            var accountName = obj.getProp("accountName");
            var paymentDate = obj.getProp("paymentDate");
            var totalAmount = obj.getProp("totalAmount");
            var SalesOrderId = obj.getProp("SalesOrderId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="SalesOrderUI_selectSalesOrder" recordId="${SalesOrderId}" module="SalesOrderUI" tabName="${tabName}">${payeeName}</a></span>
                        <span class="pull-right">${accountName}</span><br/>
                    </div>
                    <div style="flex: 100%;">
                        <span><a href="#" class="SalesOrderUI_selectSalesOrder" recordId="${SalesOrderId}" module="SalesOrderUI" tabName="${tabName}"><i class="fa fa-calendar"> Total: </i> ${paymentDate}</a></span>
                        <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Total: </i> ${totalAmount}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}