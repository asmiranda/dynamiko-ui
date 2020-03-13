class RealEstateTaxUI {
    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadTopRealEstateTaxes() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/realEstateTaxUI/getTopRealEstateTaxes`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            realEstateTaxUI.arrangeSearchedRealEstateTaxes(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedRealEstateTaxes(data) {
        console.log(data);
        var divName = `.searchRealEstateTaxes[module="realEstateTaxUI"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var RealEstateTaxId = obj.getProp("RealEstateTaxId");

            var customerName = obj.getProp("customerName");
            var customerEmail = obj.getProp("customerEmail");

            var employeeName = obj.getPropDefault("employeeName", "");
            var totalAmount = obj.getPropDefault("totalAmount", "");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="selectRealEstateTax" recordId="${RealEstateTaxId}" module="realEstateTaxUI">${customerName}</a></span>
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

    arrangeSearchedRealEstateTaxs(data) {
        console.log(data);
        var divName = `.searchRealEstateTax[module="realEstateTaxUI"]`;
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
                        <span><a href="#" class="selectRealEstateTax" recordId="${customerId}" module="realEstateTaxUI">${customerName}</a></span>
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

    loadRealEstateTaxProfile(obj, tabName) {
        console.log(`loadRealEstateTaxProfile for ${tabName}`);
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/realEstateTaxUI/getRealEstateTaxProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            realEstateTaxUI.arrangeRealEstateTaxProfile(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeRealEstateTaxProfile(data, clsName) {
        $(`.edit${clsName}`).each(function(index, obj) {
            var key = $(obj).attr("name");
            if (key) {
                var value = data.getProp(key);
                console.log(key + " -> " + value);
                $(`.edit${clsName}[name="${key}"]`).val(value);    
            }
        });
        realEstateTaxUI.loadAutoCompleteRowLabel("customerCode", 1);

        var recordId = $(`.edit${clsName}[name="RealEstateTaxId"]`).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/realEstateTaxUI/getRealEstateTaxItems/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            $(data).each(function(index, obj) {
                realEstateTaxUI.arrangeRealEstateTaxItem(index+100, obj, clsName);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeRealEstateTaxItem(rowIndex, data, clsName) {
        console.log(rowIndex, data, clsName);
        var productCode = data.getProp("productCode");
        var unitPrice = data.getProp("unitPrice");
        var quantity = data.getProp("quantity");
        var totalAmount = data.getProp("totalAmount");

        $(`.edit${clsName}[module="RealEstateTaxItemUI"][rowIndex="${rowIndex}"][name="productCode"]`).val(productCode);    
        $(`.edit${clsName}[module="RealEstateTaxItemUI"][rowIndex="${rowIndex}"][name="unitPrice"]`).val(unitPrice);    
        $(`.edit${clsName}[module="RealEstateTaxItemUI"][rowIndex="${rowIndex}"][name="quantity"]`).val(quantity);    
        $(`.edit${clsName}[module="RealEstateTaxItemUI"][rowIndex="${rowIndex}"][name="totalAmount"]`).val(totalAmount);    
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

    selectRealEstateTax(obj) {
        console.log("selectRealEstateTax");
        console.log("Record ID == "+$(obj).attr("recordId"));
        realEstateTaxUI.loadRealEstateTaxProfile(obj, "RealEstateTax");
    }

    selectRealEstateTax(obj) {
        console.log("selectRealEstateTax");
        console.log("Record ID == "+$(obj).attr("recordId"));
        realEstateTaxUI.loadRealEstateTaxProfile(obj, "Sale");
    }
}