class BankingUI extends AbstractSubUI {
    constructor(moduleName) {
        super(moduleName);
    }
    
    beforeSave(data) {
        data["BankingTransactionUI"] = utils.collectSubRecordDataForSaving("editRecord", "BankingTransactionUI");
        return data;
    }

    newRecord() {  
        this.clearModuleInputs("BankingUI");
        this.clearItemsHolder("BankingTransactionUI");
    }

    arrangeRecordProfileItems(data, clsName) {
        this.formatItems("BankingTransactionUI", data, clsName);
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

