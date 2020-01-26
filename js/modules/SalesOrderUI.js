class SalesOrderUI {
    onfocusout(obj) {
        console.log("SalesOrderUI change "+obj);
        if ("|totalBeforeDiscount|discountAmount|freightAmount|totalAmount|taxAmount|".includes("|"+obj.name)+"|") {
            salesOrderUI.calculateAmounts();
        }
    }

    calculateAmounts() {
        var totalBeforeDiscount = salesOrderUI.getSalesOrderItemTotalAmount();
        if (totalBeforeDiscount > 0) {
            var discountAmount = $("input[name='discountAmount']").val();
            var freightAmount = $("input[name='freightAmount']").val();
            var totalAmount = extractFloat(totalBeforeDiscount)-extractFloat(discountAmount)+extractFloat(freightAmount);
            var taxAmount = $("input[name='taxAmount']").val();

            $("input[name='totalBeforeDiscount']").val(totalBeforeDiscount);    
            $("input[name='totalAmount']").val(parseFloat(totalBeforeDiscount)-extractFloat(discountAmount)+extractFloat(freightAmount));
            $("input[name='overallAmount']").val(extractFloat(totalAmount)+extractFloat(taxAmount));
        }
        else {
            $("input[name='totalBeforeDiscount']").val(0);
            $("input[name='discountAmount']").val(0);
            $("input[name='freightAmount']").val(0);
            $("input[name='totalAmount']").val(0);
            $("input[name='taxAmount']").val(0);
            $("input[name='overallAmount']").val(0);
        }
    }

    getSalesOrderItemTotalAmount() {
        var totalItemAmount = 0;
        var coll = $("table[submodule='SalesOrderItemUI'] td:last-child");
        $(coll).each(function() {
            var val = $(this).html();
            console.log(val);

            totalItemAmount += parseFloat(val);
        });
        return totalItemAmount;
    }

    onsaveChild(subModuleName) {
        console.log("SalesOrderUI saveChild "+subModuleName);
        salesOrderUI.calculateAmounts();
    }
}