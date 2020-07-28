class Storage {
    storeAccountToken(uname, data) {
        localStorage.uname = uname;
        localStorage.token = data.token;
        localStorage.companyCode = data.companyCode;
    }

    putLatestModule(moduleName) {
        var key = localStorage.uname + "-latestModule";
        lStorage.set(key, moduleName);
    }

    getLatestModule() {
        var key = localStorage.uname + "-latestModule";
        var value = lStorage.get(key);
        return value;
    }

    putLatestModuleId(moduleId) {
        var key = localStorage.uname + "-latestModuleId";
        lStorage.set(key, moduleId);
    }

    getLatestModuleId() {
        var key = localStorage.uname + "-latestModuleId";
        var value = lStorage.get(key);
        return value;
    }

    putLatestModuleCode(moduleCode) {
        var key = localStorage.uname + "-latestModuleCode";
        lStorage.set(key, moduleCode);
    }

    getLatestModuleCode() {
        var key = localStorage.uname + "-latestModuleCode";
        var value = lStorage.get(key);
        return value;
    }
}

$(function () {
    lStorage = {
        set: function (key, value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key) {
            try {
                return JSON.parse(window.localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        }
    };
    sStorage = {
        set: function (key, value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key) {
            try {
                return JSON.parse(window.localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        }
    };

    storage = new Storage();
});

