class SalesOrderUI {
    constructor() {
        this.init();
    }

    init() {
        var context = this;
        $("input").change(function() {
            context.change(this);
        });
    }

    change(obj) {
        console.log("SalesOrderUI change "+obj);
    }

    saveChild(subModuleName) {
        console.log("SalesOrderUI saveChild "+subModuleName);
    }
}