class ExpenseUI {
    saveExpense(obj) {
        console.log("saveExpense called");
        var tmp = utils.collectDataForSaving("editExpense", "ExpenseUI", "0");
        tmp["expenseItems"] = utils.collectSubRecordDataForSaving("editExpense", "ExpenseItemUI");
        tmp["expenseCategoryItems"] = utils.collectSubRecordDataForSaving("editExpense", "ExpenseCategoryItemUI");

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ExpenseUI/post/saveExpense`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Save Expense Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadExpenseProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ExpenseUI/getExpenseProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            expenseUI.arrangeExpenseProfile(data, "editExpense");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeExpenseProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, "ExpenseUI");

        $(`.editExpense[module="ExpenseCategoryItemUI"]`).val("");
        var items = data.getProp("expenseCategoryItems");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "ExpenseCategoryItemUI");
        })

        $(`.editExpense[module="ExpenseItemUI"]`).val("");
        var items = data.getProp("expenseItems");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "ExpenseItemUI");
        })
    }

    searchExpenseFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ExpenseUI/getFilteredExpenses/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            expenseUI.arrangeSearchedExpenses(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopExpenses(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/ExpenseUI/getTopExpenses`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            expenseUI.arrangeSearchedExpenses(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedExpenses(data, tabName) {
        var divSelector = `.ExpenseUI_SearchExpenses[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var payeeName = obj.getProp("payeeName");
            var accountName = obj.getProp("accountName");
            var paymentDate = obj.getProp("paymentDate");
            var totalAmount = obj.getProp("totalAmount");
            var ExpenseId = obj.getProp("ExpenseId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="ExpenseUI_selectExpense" recordId="${ExpenseId}" module="ExpenseUI" tabName="${tabName}">${payeeName}</a></span>
                        <span class="pull-right">${accountName}</span><br/>
                    </div>
                    <div style="flex: 100%;">
                        <span><a href="#" class="ExpenseUI_selectExpense" recordId="${ExpenseId}" module="ExpenseUI" tabName="${tabName}"><i class="fa fa-calendar"> Total: </i> ${paymentDate}</a></span>
                        <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Total: </i> ${totalAmount}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}