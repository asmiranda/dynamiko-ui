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
        else if (this.module == 'PayrollScheduleUI') {
            this.moduleObj = new PayrollScheduleUI();
        }
    }

    doSpecialAction(data) {
        this.moduleObj.doSpecialAction(data);
    }

    saveChild(subModuleName) {
        this.moduleObj.onsaveChild(subModuleName);
    }

    getModuleScript() {
        return this.moduleObj;
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

function zeroNaN(val) {
    if (isNaN(val)) {
        return 0;
    }
    else {
        return val;
    }
}
