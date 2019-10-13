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
    }

    saveChild(subModuleName) {
        this.moduleObj.saveChild(subModuleName);
    }

}