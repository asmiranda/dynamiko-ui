class ElectricalPermitUI {
    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadTopElectricalPermits() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ElectricalPermitUI/getTopElectricalPermits`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            electricalPermitUI.arrangeSearchedElectricalPermits(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedElectricalPermits(data) {
        console.log(data);
        var divName = `.searchElectricalPermits[module="ElectricalPermitUI"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var ElectricalPermitId = obj.getProp("ElectricalPermitId");

            var customerName = obj.getProp("customerName");
            var customerEmail = obj.getProp("customerEmail");

            var employeeName = obj.getPropDefault("employeeName", "");
            var totalAmount = obj.getPropDefault("totalAmount", "");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="selectElectricalPermit" recordId="${ElectricalPermitId}" module="ElectricalPermitUI">${customerName}</a></span>
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

    arrangeSearchedElectricalPermits(data) {
        console.log(data);
        var divName = `.searchElectricalPermit[module="ElectricalPermitUI"]`;
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
                        <span><a href="#" class="selectElectricalPermit" recordId="${customerId}" module="ElectricalPermitUI">${customerName}</a></span>
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

    loadElectricalPermitProfile(obj, tabName) {
        console.log(`loadElectricalPermitProfile for ${tabName}`);
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ElectricalPermitUI/getElectricalPermitProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            electricalPermitUI.arrangeElectricalPermitProfile(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeElectricalPermitProfile(data, clsName) {
        $(`.edit${clsName}`).each(function(index, obj) {
            var key = $(obj).attr("name");
            if (key) {
                var value = data.getProp(key);
                console.log(key + " -> " + value);
                $(`.edit${clsName}[name="${key}"]`).val(value);    
            }
        });
        electricalPermitUI.loadAutoCompleteRowLabel("customerCode", 1);

        var recordId = $(`.edit${clsName}[name="ElectricalPermitId"]`).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ElectricalPermitUI/getElectricalPermitItems/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            $(data).each(function(index, obj) {
                electricalPermitUI.arrangeElectricalPermitItem(index+100, obj, clsName);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeElectricalPermitItem(rowIndex, data, clsName) {
        console.log(rowIndex, data, clsName);
        var productCode = data.getProp("productCode");
        var unitPrice = data.getProp("unitPrice");
        var quantity = data.getProp("quantity");
        var totalAmount = data.getProp("totalAmount");

        $(`.edit${clsName}[module="ElectricalPermitItemUI"][rowIndex="${rowIndex}"][name="productCode"]`).val(productCode);    
        $(`.edit${clsName}[module="ElectricalPermitItemUI"][rowIndex="${rowIndex}"][name="unitPrice"]`).val(unitPrice);    
        $(`.edit${clsName}[module="ElectricalPermitItemUI"][rowIndex="${rowIndex}"][name="quantity"]`).val(quantity);    
        $(`.edit${clsName}[module="ElectricalPermitItemUI"][rowIndex="${rowIndex}"][name="totalAmount"]`).val(totalAmount);    
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

    selectElectricalPermit(obj) {
        console.log("selectElectricalPermit");
        console.log("Record ID == "+$(obj).attr("recordId"));
        electricalPermitUI.loadElectricalPermitProfile(obj, "ElectricalPermit");
    }

    selectElectricalPermit(obj) {
        console.log("selectElectricalPermit");
        console.log("Record ID == "+$(obj).attr("recordId"));
        electricalPermitUI.loadElectricalPermitProfile(obj, "Sale");
    }
}