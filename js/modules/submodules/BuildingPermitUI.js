class BuildingPermitUI {
    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadTopBuildingPermits() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BuildingPermitUI/getTopBuildingPermits`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            buildingPermitUI.arrangeSearchedBuildingPermits(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedBuildingPermits(data) {
        console.log(data);
        var divName = `.searchBuildingPermits[module="BuildingPermitUI"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var BuildingPermitId = obj.getProp("BuildingPermitId");

            var customerName = obj.getProp("customerName");
            var customerEmail = obj.getProp("customerEmail");

            var employeeName = obj.getPropDefault("employeeName", "");
            var totalAmount = obj.getPropDefault("totalAmount", "");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="selectBuildingPermit" recordId="${BuildingPermitId}" module="BuildingPermitUI">${customerName}</a></span>
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

    arrangeSearchedBuildingPermits(data) {
        console.log(data);
        var divName = `.searchBuildingPermit[module="BuildingPermitUI"]`;
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
                        <span><a href="#" class="selectBuildingPermit" recordId="${customerId}" module="BuildingPermitUI">${customerName}</a></span>
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

    loadBuildingPermitProfile(obj, tabName) {
        console.log(`loadBuildingPermitProfile for ${tabName}`);
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BuildingPermitUI/getBuildingPermitProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            buildingPermitUI.arrangeBuildingPermitProfile(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeBuildingPermitProfile(data, clsName) {
        $(`.edit${clsName}`).each(function(index, obj) {
            var key = $(obj).attr("name");
            if (key) {
                var value = data.getProp(key);
                console.log(key + " -> " + value);
                $(`.edit${clsName}[name="${key}"]`).val(value);    
            }
        });
        buildingPermitUI.loadAutoCompleteRowLabel("customerCode", 1);

        var recordId = $(`.edit${clsName}[name="BuildingPermitId"]`).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BuildingPermitUI/getBuildingPermitItems/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            $(data).each(function(index, obj) {
                buildingPermitUI.arrangeBuildingPermitItem(index+100, obj, clsName);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeBuildingPermitItem(rowIndex, data, clsName) {
        console.log(rowIndex, data, clsName);
        var productCode = data.getProp("productCode");
        var unitPrice = data.getProp("unitPrice");
        var quantity = data.getProp("quantity");
        var totalAmount = data.getProp("totalAmount");

        $(`.edit${clsName}[module="BuildingPermitItemUI"][rowIndex="${rowIndex}"][name="productCode"]`).val(productCode);    
        $(`.edit${clsName}[module="BuildingPermitItemUI"][rowIndex="${rowIndex}"][name="unitPrice"]`).val(unitPrice);    
        $(`.edit${clsName}[module="BuildingPermitItemUI"][rowIndex="${rowIndex}"][name="quantity"]`).val(quantity);    
        $(`.edit${clsName}[module="BuildingPermitItemUI"][rowIndex="${rowIndex}"][name="totalAmount"]`).val(totalAmount);    
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

    selectBuildingPermit(obj) {
        console.log("selectBuildingPermit");
        console.log("Record ID == "+$(obj).attr("recordId"));
        buildingPermitUI.loadBuildingPermitProfile(obj, "BuildingPermit");
    }

    selectBuildingPermit(obj) {
        console.log("selectBuildingPermit");
        console.log("Record ID == "+$(obj).attr("recordId"));
        buildingPermitUI.loadBuildingPermitProfile(obj, "Sale");
    }
}