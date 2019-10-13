class ModuleScript {
    constructor(module) {
        this.module = module;
        this.moduleObj;
        this.init();
    }

    init() {
        if (this.module == 'SalesOrderUI') {
            this.moduleObj = new SalesOrderUI();
        }
        else if (this.module == 'PurchaseOrderUI') {
            this.moduleObj = new PurchaseOrderUI();
        }
    }

    saveChild(subModuleName) {
        this.moduleObj.onsaveChild(subModuleName);
    }
}

function extractInt(obj) {
    var val = obj.replace(',' , '');
    val = parseInt(val);
    return val;
}

function extractFloat(obj) {
    var val = obj.replace(',', '');
    val = parseFloat(val);
    return val;
}
