class SalesOrderUI extends AbstractSubUI {
    beforeSave(data) {
        data["RecordItems"] = utils.collectSubRecordDataForSaving(`edit${this.moduleName}`, "RecordItemUI");
        data["RecordCategoryItems"] = utils.collectSubRecordDataForSaving(`edit${this.moduleName}`, "RecordCategoryItemUI");
        return data;
    }

    arrangeRecordProfileItems(data, clsName) {
    }

    arrangeSearchedSalesOrders(data, tabName) {
        var divSelector = `.SalesOrderUI_SearchSalesOrders[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var payeeName = obj.getProp("customerName");
            var accountName = obj.getProp("employeeName");
            var paymentDate = obj.getProp("invoiceDate");
            var totalAmount = obj.getProp("totalAmount");
            var SalesOrderId = obj.getProp("SalesOrderId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span><a href="#" class="SalesOrderUI_selectSalesOrder" recordId="${SalesOrderId}" module="SalesOrderUI" tabName="${tabName}">${payeeName}</a></span>
                        <span class="pull-right">${accountName}</span><br/>
                    </div>
                    <div style="flex: 100%;">
                        <span><a href="#" class="SalesOrderUI_selectSalesOrder" recordId="${SalesOrderId}" module="SalesOrderUI" tabName="${tabName}"><i class="fa fa-calendar"> Total: </i> ${paymentDate}</a></span>
                        <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Total: </i> ${totalAmount}</span><br/>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}