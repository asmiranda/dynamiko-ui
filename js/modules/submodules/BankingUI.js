class BankingUI extends AbstractSubUI {
    constructor(moduleName) {
        super(moduleName);
        var context = this;
        $(document).on('click', '.selectSearchRecord[module="BankingUI"]', function() {
            bankingUI.loadRecordProfile(this);
        });
        $(document).on('click', '.btnSaveRecord[module="BankingUI"]', function() {
            bankingUI.saveRecord(this);
        });
        $(document).on('click', '.btnNewRecord[module="BankingUI"]', function() {
            bankingUI.newRecord(this);
        });
    }
    
    beforeSave(data) {
        data["BankingTransactions"] = utils.collectSubRecordDataForSaving("editRecord", "BankingTransactionUI");
        return data;
    }

    arrangeRecordProfileItems(data, clsName) {
        $(`.editRecord[module="BankingTransactionUI"]`).val("");
        var items = data.getProp("BankingTransactions");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "BankingTransactionUI");
        })
    }

    formatSearchList(index, obj, tabName) {
        var payeeName = obj.getProp("bankName");
        var accountName = obj.getProp("bankAccountNumber");
        var paymentDate = obj.getPropDefault("bankCode","--");
        var totalAmount = obj.getPropDefault("balance","--");
        var BankingId = obj.getProp("BankingId");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="selectSearchRecord" recordId="${BankingId}" module="BankingUI" tabName="${tabName}">${payeeName}</a></span>
                    <span class="pull-right">${accountName}</span><br/>
                </div>
                <div style="flex: 100%;">
                    <span><a href="#" class="selectSearchRecord" recordId="${BankingId}" module="BankingUI" tabName="${tabName}">${paymentDate}</a></span>
                    <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Balance: </i> ${totalAmount}</span><br/>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    bankingUI = new BankingUI("BankingUI");
});

