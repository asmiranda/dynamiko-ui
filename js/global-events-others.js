class GlobalEventsOthers {
    initializeGlobalEvents() {
        $(document).on('click', '.ProductUI_selectProduct[tabName="EquipmentsMaterials"]', function() {
            inventoryUI.selectProduct(this);
        });
        $(document).on('click', '.ProductUI_selectProduct[tabName="POProduct"]', function() {
            purchaseOrderUI.selectProduct(this);
        });
        $(document).on('click', '.SupplierUI_selectSupplier[tabName="POSupplier"]', function() {
            purchaseOrderUI.selectSupplier(this);
        });

        
        $(document).on('keyup', '.searchProductFilter[module="ProductUI"]', function() {
            productUI.searchProductFilter(this);
        });
        $(document).on('keyup', '.searchSupplierFilter[module="SupplierUI"]', function() {
            supplierUI.searchSupplierFilter(this);
        });
        $(document).on('click', '.teamMemberSelect[module="EmployeeTeamMemberUI"]', function() {
            employeeTeamMemberUI.selectTeamMember(this);
        });
        $(document).on('click', '.PersonTaskUI_btnShowAddTask', function() {
            personTaskUI.showAddTask(this);
        });
        $(document).on('click', '.PersonTaskUI_btnShowUpdateTask', function() {
            personTaskUI.showUpdateTask(this);
        });
        $(document).on('click', '.PersonTaskUI_btnAddTaskNew', function() {
            personTaskUI.saveTask(this, "NEW");
        });
        $(document).on('click', '.PersonTaskUI_btnAddTaskClose', function() {
            personTaskUI.saveTask(this, "CLOSE");
        });
        $(document).on('click', '.PersonTaskUI_btnDeleteTask', function() {
            personTaskUI.deleteTask(this);
        });
    }
}
