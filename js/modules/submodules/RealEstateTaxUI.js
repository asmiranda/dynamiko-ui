class RealEstateTaxUI {
    init() {
        $("#dynamikoMainSearch").hide();
    }

    saveRealEstateTaxForCashier(obj) {
        console.log("saveRealEstateTaxForCashier called");
        var tmp = realEstateTaxUI.collectDataForSaving("editRealEstateTax", "RealEstateTaxUI", "0");
        tmp["taxItems"] = realEstateTaxUI.collectSubRecordDataForSaving("editRealEstateTax", "RealEstateTaxItemUI");

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateTaxUI/post/saveRealEstateTaxForCashier`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Save Real Estate Tax Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    collectDataForSaving(clsName, moduleName, rowIndex) {
        var tmp = {};
        $(`.${clsName}[module="${moduleName}"][rowIndex="${rowIndex}"]`).each(function (index, myObj) {
            var name = $(myObj).attr("name");
            var value = $(myObj).val();

            tmp[name] = value;
        });
        return tmp;
    }

    collectSubRecordDataForSaving(clsName, moduleName) {
        var tmp = [];
        for (var i=1; i<=10; i++) {
            var rec = realEstateTaxUI.collectDataForSaving(clsName, moduleName, i);
            tmp.push(rec);
        }
        return tmp;
    }

    loadTopRealEstateTaxes() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateTaxUI/getTopRealEstateTaxes`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            realEstateTaxUI.arrangeSearchedRealEstateTaxes(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedRealEstateTaxes(data) {
        console.log(data);
        var divName = `.searchRealEstateTaxes[module="RealEstateTaxUI"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var RealEstateTaxId = obj.getProp("RealEstateTaxId");

            var customerName = obj.getProp("citizenName");
            var years = obj.getProp("startYear")+"-"+obj.getProp("endYear");

            var employeeName = obj.getPropDefault("firstName", "")+" "+obj.getPropDefault("lastName", "");
            var totalAmount = obj.getPropDefault("totalAmount", ""); 
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="selectRealEstateTax" recordId="${RealEstateTaxId}" module="RealEstateTaxUI">${customerName}</a></span>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted pull-right"><i class="fa fa-calendar"></i> ${years}</small>
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

    loadLastSelectedRealEstateTax() {
        if (localStorage.latestRealEstateTaxId>0) {
            realEstateTaxUI.loadRealEstateTaxProfile(localStorage.latestRealEstateTaxId);
        }
    }

    loadRealEstateTaxProfile(obj) {
        console.log(`loadRealEstateTaxProfile`);
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateTaxUI/getRealEstateTaxProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            realEstateTaxUI.arrangeRealEstateTaxProfile(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeRealEstateTaxProfile(data) {
        var clsName = "editRealEstateTax";
        utils.loadDataAndAutoComplete(clsName, data, 0, "RealEstateTaxUI");

        var recordId = $(`.${clsName}[name="RealEstateTaxId"]`).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateTaxUI/getRealEstateTaxItems/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log("Real Estate Tax Items --->", data);
            $(data).each(function(index, obj) {
                realEstateTaxUI.arrangeRealEstateTaxItem(clsName, obj, index+1, "RealEstateTaxItemUI");
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeRealEstateTaxItem(clsName, data, rowIndex, moduleName) {
        utils.loadDataAndAutoComplete(clsName, data, rowIndex, moduleName);
    }

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