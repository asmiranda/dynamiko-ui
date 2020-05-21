class SalesOrderUI extends AbstractSubUI {
    constructor(moduleName) {
        super(moduleName);
        var context = this;
        $(document).on('click', '.selectSearchRecord', function() {
            salesOrderUI.loadRecordProfile(this);
        });
    }
    
    beforeSave(data) {
        data["SalesOrderItems"] = utils.collectSubRecordDataForSaving("editRecord", "SalesOrderItemUI");
        return data;
    }

    arrangeRecordProfileItems(data, clsName) {
        $(`.editRecord[module="SalesOrderItemUI"]`).val("");
        var items = data.getProp("SalesOrderItems");
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, "SalesOrderItemUI");
        })
    }

    formatSearchList(index, obj, tabName) {
        var payeeName = obj.getProp("customerName");
        var accountName = obj.getProp("employeeName");
        var paymentDate = obj.getProp("invoiceDate");
        var totalAmount = obj.getProp("totalAmount");
        var SalesOrderId = obj.getProp("SalesOrderId");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="selectSearchRecord" recordId="${SalesOrderId}" module="SalesOrderUI" tabName="${tabName}">${payeeName}</a></span>
                    <span class="pull-right">${accountName}</span><br/>
                </div>
                <div style="flex: 100%;">
                    <span><a href="#" class="selectSearchRecord" recordId="${SalesOrderId}" module="SalesOrderUI" tabName="${tabName}"><i class="fa fa-calendar"> Total: </i> ${paymentDate}</a></span>
                    <span class="pull-right" style="font-size: 14px;"><i class="fa fa-money"> Total: </i> ${totalAmount}</span><br/>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    salesOrderUI = new SalesOrderUI("SalesOrderUI");
});

