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
            salesOrderUI.arrangeSalesOrderProfile(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeSalesOrderProfile(data, clsName) {
        $(`.edit${clsName}`).each(function(index, obj) {
            var key = $(obj).attr("name");
            if (key) {
                var value = data.getProp(key);
                console.log(key + " -> " + value);
                $(`.edit${clsName}[name="${key}"]`).val(value);    
            }
        });
        salesOrderUI.loadAutoCompleteRowLabel("customerCode", 1);

        var recordId = $(`.edit${clsName}[name="SalesOrderId"]`).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/SalesOrderUI/getSalesOrderItems/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            $(data).each(function(index, obj) {
                salesOrderUI.arrangeSalesOrderItem(index+100, obj, clsName);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeSalesOrderItem(rowIndex, data, clsName) {
        console.log(rowIndex, data, clsName);
        var productCode = data.getProp("productCode");
        var unitPrice = data.getProp("unitPrice");
        var quantity = data.getProp("quantity");
        var totalAmount = data.getProp("totalAmount");

        $(`.edit${clsName}[module="SalesOrderItemUI"][rowIndex="${rowIndex}"][name="productCode"]`).val(productCode);    
        $(`.edit${clsName}[module="SalesOrderItemUI"][rowIndex="${rowIndex}"][name="unitPrice"]`).val(unitPrice);    
        $(`.edit${clsName}[module="SalesOrderItemUI"][rowIndex="${rowIndex}"][name="quantity"]`).val(quantity);    
        $(`.edit${clsName}[module="SalesOrderItemUI"][rowIndex="${rowIndex}"][name="totalAmount"]`).val(totalAmount);    
    }

    loadAutoCompleteRowLabel(field, rowIndex) {
        console.log(`loadAutoCompleteRowLabel == [autoname=${field}] == `);
        var tmpLabel = $(`[class~='autocomplete'][autoname='${field}'][rowIndex='${rowIndex}']`);
        tmpLabel.val("");

        var hiddenAutoComplete = `.HiddenAutoComplete[name="${field}"][rowIndex='${rowIndex}']`;
        var moduleName = $(hiddenAutoComplete).attr("module");
        var value = $(hiddenAutoComplete).val();

        if (value!=null && value!="") {
            var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/autocompletelabel/${moduleName}/${field}/${value}`;
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                console.log(data);
                var divDescAutoComplete = $(`[class~='DivAutoComplete'][autoname='${data.getProp("fieldName")}'][rowIndex='${rowIndex}']`);
                divDescAutoComplete.html(data.getProp("value"));
                var fieldAutoComplete = $(`[class~='autocomplete'][autoname='${data.getProp("fieldName")}'][rowIndex='${rowIndex}']`);
                fieldAutoComplete.val(data.getProp("value"));
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
    };

    selectEstimate(obj) {
        console.log("selectEstimate");
        console.log("Record ID == "+$(obj).attr("recordId"));
        salesOrderUI.loadSalesOrderProfile(obj, "Estimate");
    }

    selectSalesOrder(obj) {
        console.log("selectSalesOrder");
        console.log("Record ID == "+$(obj).attr("recordId"));
        salesOrderUI.loadSalesOrderProfile(obj, "Sale");
    }
}