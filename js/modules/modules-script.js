class ModuleScript {
    getModuleObj(module) {
        this.module = module;
        var moduleObj;

        if (this.module == 'SalesOrderUI') {
            moduleObj = new SalesOrderUI();
        }
        else if (this.module == 'PurchaseOrderUI') {
            moduleObj = new PurchaseOrderUI();
        }
        else if (this.module == 'PayrollScheduleUI') {
            moduleObj = new PayrollScheduleUI();
        }
        else if (this.module == 'UserUI') {
            moduleObj = new UserUI();
        }
        return moduleObj;
    }

    doSpecialAction(module, data) {
        getModuleObj(module).doSpecialAction(subModuleName, data);
    }

    saveChild(module, subModuleName) {
        getModuleObj(module).onsaveChild(subModuleName);
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

$(function () {
    moduleScript = new ModuleScript();
});
