class SalesOrderUI {
    changeMainId(obj) {
        utils.loadRecordToForm(obj, salesOrderUI);
    }

    doMainSearchData(evt) {
    }

    changeModule(evt) {
        salesOrderUI.init();
        salesOrderUI.loadTopEstimates();
        salesOrderUI.loadTopSalesOrders();
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadTopEstimates() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/getTopEstimates`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            salesOrderUI.arrangeSearchedEstimates(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopSalesOrders() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/getTopSalesOrders`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            salesOrderUI.arrangeSearchedSalesOrders(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedEstimates(data) {
        console.log(data);
        var divName = `.searchEstimates[module="SalesOrderUI"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var salesOrderId = obj.getProp("salesOrderId");

            var customerName = obj.getProp("customerName");
            var customerEmail = obj.getProp("customerEmail");

            var employeeName = obj.getPropDefault("employeeName", "");
            var totalAmount = obj.getPropDefault("totalAmount", "");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="selectEstimate" recordId="${salesOrderId}" module="SalesOrderUI">${customerName}</a></span>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted pull-right"><i class="fa fa-mail"></i> ${customerEmail}</small>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted"><i class="fa fa-compass"> Employee: </i> ${employeeName}</small>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted pull-right"><i class="fa fa-compass"> Total: </i> ${totalAmount}</small>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divName).append(str);            
        });
    }

    arrangeSearchedSalesOrders(data) {
        console.log(data);
        var divName = `.searchSalesOrder[module="SalesOrderUI"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var customerName = obj.getProp("customerName");
            var customerEmail = obj.getProp("customerEmail");
            var customerId = obj.getProp("customerId");

            var employeeName = obj.getPropDefault("employeeName", "");
            var totalAmount = obj.getPropDefault("totalAmount", "");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="selectSalesOrder" recordId="${customerId}" module="SalesOrderUI">${customerName}</a></span>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted pull-right"><i class="fa fa-mail"></i> ${customerEmail}</small>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted"><i class="fa fa-compass"> Employee: </i> ${employeeName}</small>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted pull-right"><i class="fa fa-compass"> Total: </i> ${totalAmount}</small>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divName).append(str);            
        });
    }

    loadSalesOrderProfile(obj, tabName) {
        console.log(`loadSalesOrderProfile for ${tabName}`);
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/getSalesOrderProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            if (tabName=="Estimates") {
                salesOrderUI.arrangeSalesOrderProfile(data, "Estimate");
            }
            else {
                salesOrderUI.arrangeSalesOrderProfile(data, "SalesOrder");
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeSalesOrderProfile(data, clsName) {
        $(`.edit${clsName}`).each(function(index, obj) {
            var key = $(obj).attr("name");
            var value = data.getProp(key);
            console.log(key + " -> " + value);
            $(`.edit${clsName}[name="${key}"]`).val(value);    
        });
    }

    selectEstimate(obj) {
        console.log("selectEstimate");
        console.log("Record ID == "+$(obj).attr("recordId"));
        salesOrderUI.loadSalesOrderProfile(obj, "Estimates");
    }

    selectSalesOrder(obj) {
        console.log("selectSalesOrder");
        console.log("Record ID == "+$(obj).attr("recordId"));
        salesOrderUI.loadSalesOrderProfile(obj, "Sales");
    }
}