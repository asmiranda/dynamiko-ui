class TaxPeriodUI {
    saveTaxPeriod(obj) { 
        console.log("saveTaxPeriod called");
        var tmp = utils.collectDataForSaving("editTaxPeriod", "TaxPeriodUI", "0");
        tmp["TaxPeriodItems"] = utils.collectSubRecordDataForSaving("editTaxPeriod", "TaxPeriodItemUI");
        tmp["TaxPeriodCategoryItems"] = utils.collectSubRecordDataForSaving("editTaxPeriod", "TaxPeriodCategoryItemUI");

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/TaxPeriodUI/post/saveTaxPeriod`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Save TaxPeriod Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadTaxPeriodProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/TaxPeriodUI/getTaxPeriodProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            taxPeriodUI.arrangeTaxPeriodProfile(data, "editTaxPeriod");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeTaxPeriodProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, "TaxPeriodUI");

        $(`.editTaxPeriod[module="TaxPeriodItemUI"]`).val("");
        var items = data.getProp("TaxPeriodItems");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "TaxPeriodItemUI");
        })
    }

    searchTaxPeriodFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/TaxPeriodUI/getFilteredTaxPeriods/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            taxPeriodUI.arrangeSearchedTaxPeriods(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopTaxPeriods(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/TaxPeriodUI/getTopTaxPeriods`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            taxPeriodUI.arrangeSearchedTaxPeriods(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedTaxPeriods(data, tabName) {
        var divSelector = `.TaxPeriodUI_SearchTaxPeriods[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var payeeName = obj.getProp("customerName");
            var accountName = obj.getProp("employeeName");
            var paymentDate = obj.getProp("invoiceDate");
            var totalAmount = obj.getProp("totalAmount");
            var TaxPeriodId = obj.getProp("TaxPeriodId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="TaxPeriodUI_selectTaxPeriod" recordId="${TaxPeriodId}" module="TaxPeriodUI" tabName="${tabName}">${payeeName}</a></span>
                        <span class="pull-right">${accountName}</span><br/>
                    </div>
                    <div style="flex: 100%;">
                        <span><a href="#" class="TaxPeriodUI_selectTaxPeriod" recordId="${TaxPeriodId}" module="TaxPeriodUI" tabName="${tabName}"><i class="fa fa-calendar"> Total: </i> ${paymentDate}</a></span>
                        <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Total: </i> ${totalAmount}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}