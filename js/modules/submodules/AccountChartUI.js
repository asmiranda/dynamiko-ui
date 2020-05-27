class AccountChartUI extends AbstractSubUI {
    constructor() {
        super("AccountChartUI");
        var context = this;
        this.GeneralLedgerUI = "GeneralLedgerUI";

        $(document).on('click', `.editAcctTransaction`, function() {
            context.editAcctTransaction(this);
        });
        $(document).on('click', `.updateAcctTransaction`, function() {
            context.updateAcctTransaction(this);
        });
    }
    
    updateAcctTransaction(obj) {
        var tmp = utils.collectDataForSaving(`editRecord`, `AcctTransactionGLEditorUI`, "0");
        tmp["GeneralLedgerEditorUI"] = utils.collectSubRecordDataForSaving("editRecord", "GeneralLedgerEditorUI");

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/post/saveAcctTransactionGL`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log("saveRecord", url, data);
            showModalAny.show("GL Save", "GL Entries saved successfully.");
            utils.hideSpin();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    editAcctTransaction(obj) {
        var context = this;
        var rowIndex = $(obj).attr("rowIndex");
        var moduleName = $(obj).html();
        var moduleCode = $(`.editRecord[rowIndex="${rowIndex}"][name="moduleCode"]`).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${context.moduleName}/getAcctTransactionGL/${moduleName}/${moduleCode}`;

        var successLoadGLData = function(data) {
            console.log("editAcctTransaction", url, data);
            utils.loadDataAndAutoComplete("editRecord", data, 0, "AcctTransactionGLEditorUI");
            context.formatSubRecordsFromMain("GeneralLedgerEditorUI", data, "editRecord");

            context.initFieldListener();
        };
        var successTransGLEditorList = function(data) {
            ajaxCaller.ajaxGet(new AjaxRequestDTO(url, ""), successLoadGLData);
        }
        var successCallback = function(data) {
            showModalAny1200.show("Transaction GL Editing", data, successTransGLEditorList);
        };
        utils.getTabHtml("AccountingUI", "AcctTransactionGLEditor", successCallback);
    }

    beforeSave(data) { 
        data[this.GeneralLedgerUI] = utils.collectSubRecordDataForSaving("editRecord", this.GeneralLedgerUI);
        return data;
    }

    newRecord() {   
        this.clearModuleInputs(this.moduleName);
        this.clearSubRecordsHolder(this.GeneralLedgerUI);
    }

    arrangeRecordProfileAllSubRecords(data, clsName) {
        this.formatSubRecordsFromMain(this.GeneralLedgerUI, data, clsName);
    }

    formatSearchList(index, obj, tabName) {
        var accountName = obj.getProp("accountName");
        var debit = obj.getProp("debit");
        var accountNumber = obj.getProp("accountNumber");
        var credit = obj.getProp("credit");
        var AccountChartId = obj.getProp("AccountChartId");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${AccountChartId}" module="${this.moduleName}" tabName="${tabName}">${accountName}</a></span>
                    <span class="pull-right">Debit: ${debit}</span><br/>
                </div>
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${AccountChartId}" module="${this.moduleName}" tabName="${tabName}">
                        Account #: ${accountNumber}</a></span>
                    <span class="pull-right" style="font-size: 14px;">Credit: ${credit}</span><br/>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    accountChartUI = new AccountChartUI();
});
