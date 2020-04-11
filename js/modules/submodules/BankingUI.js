class BankingUI {
    saveBanking(obj) {
        console.log("saveBanking called");
        var tmp = utils.collectDataForSaving("editBanking", "BankingUI", "0");
        tmp["BankingItems"] = utils.collectSubRecordDataForSaving("editBanking", "BankingItemUI");
        tmp["BankingCategoryItems"] = utils.collectSubRecordDataForSaving("editBanking", "BankingCategoryItemUI");

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BankingUI/post/saveBanking`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Save Banking Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadBankingProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BankingUI/getBankingProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            bankingUI.arrangeBankingProfile(data, "editBanking");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeBankingProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, "BankingUI");
        $("#BankingTransactionRecordHolder").empty();
        var html = $("#BankingTransactionRecordTemplate").html();

        $(`.editBanking[module="BankingTransactionUI"]`).val("");
        var items = data.getProp("BankingTransactions");
        $(items).each(function(index, obj) {
            var newHtml = utils.replaceAll(html, "----", index+1);
            $("#BankingTransactionRecordHolder").append(newHtml);
        })
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "BankingTransactionUI");
        })
    }

    searchBankingFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BankingUI/getFilteredBankings/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            bankingUI.arrangeSearchedBankings(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopBankings(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BankingUI/getTopBankings`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            bankingUI.arrangeSearchedBankings(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedBankings(data, tabName) {
        var divSelector = `.BankingUI_SearchBankings[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var payeeName = obj.getProp("bankName");
            var accountName = obj.getProp("bankAccountNumber");
            var paymentDate = obj.getPropDefault("bankCode","--");
            var totalAmount = obj.getPropDefault("balance","--");
            var BankingId = obj.getProp("BankingId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="BankingUI_selectBanking" recordId="${BankingId}" module="BankingUI" tabName="${tabName}">${payeeName}</a></span>
                        <span class="pull-right">${accountName}</span><br/>
                    </div>
                    <div style="flex: 100%;">
                        <span><a href="#" class="BankingUI_selectBanking" recordId="${BankingId}" module="BankingUI" tabName="${tabName}">${paymentDate}</a></span>
                        <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Balance: </i> ${totalAmount}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}