class Storage {
    constructor() {
        // this.myStorage = window.localStorage;
        this.myStorage = window.sessionStorage;
    }

    clear() {
        this.myStorage.clear();
    }

    getUname() {
        return this.myStorage.uname;
    }

    getToken() {
        return this.myStorage.token;
    }

    getCompanyCode() {
        return this.myStorage.companyCode;
    }

    storeAccountToken(uname, data) {
        this.myStorage.uname = uname;
        this.myStorage.token = data.token;
        this.myStorage.companyCode = data.companyCode;
    }

    putLatestModule(moduleName) {
        this.myStorage.latestModule = moduleName;
    }

    getLatestModule() {
        return this.myStorage.latestModule;
    }

    putLatestModuleId(moduleId) {
        this.myStorage.latestModuleId = moduleId;
    }

    getLatestModuleId() {
        return this.myStorage.latestModuleId;
    }

    putLatestModuleCode(moduleCode) {
        this.myStorage.latestModuleCode = moduleCode;
    }

    getLatestModuleCode() {
        return this.myStorage.latestModuleCode;
    }

    set(key, value) {
        this.myStorage.setItem(key, JSON.stringify(value));
    }

    get(key) {
        try {
            return JSON.parse(this.myStorage.getItem(key));
        } catch (e) {
            return null;
        }
    }
}

$(function () {
    storage = new Storage();
});

