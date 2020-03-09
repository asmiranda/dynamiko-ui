class GlobalEventsAccounting {
    initializeGlobalEvents() {

        $(document).on('click', '.selectEstimate', function() {
            salesOrderUI.selectEstimate(this);
        });
        $(document).on('click', '.selectSalesOrder', function() {
            salesOrderUI.selectSalesOrder(this);
        });

    }
}
