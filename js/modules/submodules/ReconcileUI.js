class ReconcileUI {
    saveReconcile(obj) { 
        console.log("saveReconcile called");
    }

    loadReconcileProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReconcileUI/getReconcileProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            reconcileUI.arrangeReconcileProfile(data, "editReconcile");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeReconcileProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, "ReconcileUI");

        $(`.editReconcile[module="ReconcileReturnUI"]`).val("");
        var items = data.getProp("ReconcileReturns");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "ReconcileReturnUI");
        })

        $(`.editReconcile[module="ReconcilePaymentUI"]`).val("");
        var items = data.getProp("ReconcilePayments");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "ReconcilePaymentUI");
        })
    }

    searchReconcileFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReconcileUI/getFilteredReconciles/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            reconcileUI.arrangeSearchedReconciles(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopReconciles(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ReconcileUI/getTopReconciles`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            reconcileUI.arrangeSearchedReconciles(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedReconciles(data, tabName) {
        var divSelector = `.ReconcileUI_SearchReconciles[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var payeeName = obj.getProp("description");
            var accountName = obj.getProp("glPeriod");
            var paymentDate = obj.getProp("transactionDate");
            var totalAmount = obj.getProp("totalAmount");
            var ReconcileId = obj.getProp("AcctTransactionId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="ReconcileUI_selectReconcile" recordId="${ReconcileId}" module="ReconcileUI" tabName="${tabName}">${payeeName}</a></span>
                        <span class="pull-right">${accountName}</span><br/>
                    </div>
                    <div style="flex: 100%;">
                        <span><a href="#" class="ReconcileUI_selectReconcile" recordId="${ReconcileId}" module="ReconcileUI" tabName="${tabName}"><i class="fa fa-calendar"> Total: </i> ${paymentDate}</a></span>
                        <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"></i> ${totalAmount}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}