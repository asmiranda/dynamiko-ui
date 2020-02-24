class PurchaseOrderUI {
    loadActivePoForProduct(obj) {
        var recordId = $(obj).attr("recordId");
        var tabName = $(obj).attr("tabName");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PurchaseOrderUI/getProductPurchaseOrder/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            purchaseOrderUI.arrangePurchaseOrder(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangePurchaseOrder(data, tabName) {
        var divSelector = `.ProductPurchaseOrderUI_SearchProducts[tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var supplierName = obj.getProp("supplierName");
            var poPrice = obj.getProp("poPrice");
            var poQuantity = obj.getProp("poQuantity");
            var purchaseOrderCode = obj.getProp("purchaseOrderCode");

            var deliveryDate = obj.getProp("deliveryDate");
            var contactPerson = obj.getProp("contactPerson");

            var puchaseOrderId = obj.getProp("poId");
            var productId = obj.getProp("productId");
            var supplierId = obj.getProp("supplierId");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 100%;">
                        <span class="text-muted"><a href="#" class="PurchaseOrderUI_selectSupplier" recordId="${supplierId}" module="PurchaseOrderUI" tabName="${tabName}">${supplierName}</a></span>
                        <span class="text-muted pull-right"># <a href="#" class="PurchaseOrderUI_selectPurchaseOrder" recordId="${puchaseOrderId}" module="PurchaseOrderUI" tabName="${tabName}">${puchaseOrderId}</a></span>
                    </div>
                    <div style="flex: 50%">
                        <span class="">Unit Price: ${poPrice}</span><br/>
                    </div>
                    <div style="flex: 50%">
                        <span class="pull-right">Quantity: ${poQuantity}</span><br/>
                    </div>
                    <div style="flex: 90%">
                        <span><i class="fa fa-calendar"></i> ${deliveryDate}</span>
                        <span class="pull-right"><i class="fa fa-phone"></i> ${contactPerson}</span>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            $(divSelector).append(str);
        });
        
    }
}
