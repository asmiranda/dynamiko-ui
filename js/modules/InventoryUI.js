class InventoryUI { 
    changeMainId(obj) {
    }

    doMainSearchData(evt) {
    }

    changeModule(evt) {
        personTaskUI.loadTodoList();
        employeeUI.loadTopEmployees();
        productUI.loadTopProducts("EquipmentsMaterials");
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }
}

