class PlumbingPermitUI {
    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadTopPlumbingPermits() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PlumbingPermitUI/getTopPlumbingPermits`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            plumbingPermitUI.arrangeSearchedPlumbingPermits(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedPlumbingPermits(data) {
        console.log(data);
        var divName = `.searchPlumbingPermits[module="PlumbingPermitUI"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var PlumbingPermitId = obj.getProp("PlumbingPermitId");

            var customerName = obj.getProp("customerName");
            var customerEmail = obj.getProp("customerEmail");

            var employeeName = obj.getPropDefault("employeeName", "");
            var totalAmount = obj.getPropDefault("totalAmount", "");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="selectPlumbingPermit" recordId="${PlumbingPermitId}" module="PlumbingPermitUI">${customerName}</a></span>
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

    arrangeSearchedPlumbingPermits(data) {
        console.log(data);
        var divName = `.searchPlumbingPermit[module="PlumbingPermitUI"]`;
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
                        <span><a href="#" class="selectPlumbingPermit" recordId="${customerId}" module="PlumbingPermitUI">${customerName}</a></span>
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

    loadPlumbingPermitProfile(obj, tabName) {
        console.log(`loadPlumbingPermitProfile for ${tabName}`);
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PlumbingPermitUI/getPlumbingPermitProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            plumbingPermitUI.arrangePlumbingPermitProfile(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangePlumbingPermitProfile(data, clsName) {
        $(`.edit${clsName}`).each(function(index, obj) {
            var key = $(obj).attr("name");
            if (key) {
                var value = data.getProp(key);
                console.log(key + " -> " + value);
                $(`.edit${clsName}[name="${key}"]`).val(value);    
            }
        });
        plumbingPermitUI.loadAutoCompleteRowLabel("customerCode", 1);

        var recordId = $(`.edit${clsName}[name="PlumbingPermitId"]`).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PlumbingPermitUI/getPlumbingPermitItems/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            $(data).each(function(index, obj) {
                plumbingPermitUI.arrangePlumbingPermitItem(index+100, obj, clsName);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangePlumbingPermitItem(rowIndex, data, clsName) {
        console.log(rowIndex, data, clsName);
        var productCode = data.getProp("productCode");
        var unitPrice = data.getProp("unitPrice");
        var quantity = data.getProp("quantity");
        var totalAmount = data.getProp("totalAmount");

        $(`.edit${clsName}[module="PlumbingPermitItemUI"][rowIndex="${rowIndex}"][name="productCode"]`).val(productCode);    
        $(`.edit${clsName}[module="PlumbingPermitItemUI"][rowIndex="${rowIndex}"][name="unitPrice"]`).val(unitPrice);    
        $(`.edit${clsName}[module="PlumbingPermitItemUI"][rowIndex="${rowIndex}"][name="quantity"]`).val(quantity);    
        $(`.edit${clsName}[module="PlumbingPermitItemUI"][rowIndex="${rowIndex}"][name="totalAmount"]`).val(totalAmount);    
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

    selectPlumbingPermit(obj) {
        console.log("selectPlumbingPermit");
        console.log("Record ID == "+$(obj).attr("recordId"));
        plumbingPermitUI.loadPlumbingPermitProfile(obj, "PlumbingPermit");
    }

    selectPlumbingPermit(obj) {
        console.log("selectPlumbingPermit");
        console.log("Record ID == "+$(obj).attr("recordId"));
        plumbingPermitUI.loadPlumbingPermitProfile(obj, "Sale");
    }
}