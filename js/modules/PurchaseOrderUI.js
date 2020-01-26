class PurchaseOrderUI {
    onfocusout(obj) {
        console.log("PurchaseOrderUI change "+obj);
        if ("|quantity|unitPrice|totalAmount|".includes("|"+obj.name)+"|") {
            purchaseOrderUI.calculateAmounts();
        }
    }

    calculateAmounts() {
        var quantity = $("input[name='quantity']").val();
        var unitPrice = $("input[name='unitPrice']").val();
        var totalAmount = extractInt(quantity) * extractFloat(unitPrice);

        $("input[name='totalAmount']").val(totalAmount);
    }

    onsaveChild(subModuleName) {
        console.log("PurchaseOrderUI saveChild "+subModuleName);
        purchaseOrderUI.calculateAmounts();
    }
}
