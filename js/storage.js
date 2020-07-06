class Storage {
    storeAccountToken(uname, data) {
        sessionStorage.uname = uname;
        sessionStorage.token = data.token;
        sessionStorage.companyCode = data.companyCode;
    }

    putLatestModule(moduleName) {
        var key = sessionStorage.uname+"-latestModule";
        lStorage.set(key, moduleName);
    }

    getLatestModule() {
        var key = sessionStorage.uname+"-latestModule";
        var value = lStorage.get(key);
        return value;
    }

    putLatestModuleId(moduleId) {
        var key = sessionStorage.uname+"-latestModuleId";
        lStorage.set(key, moduleId);
    }

    getLatestModuleId() {
        var key = sessionStorage.uname+"-latestModuleId";
        var value = lStorage.get(key);
        return value;
    }

    putLatestModuleCode(moduleCode) {
        var key = sessionStorage.uname+"-latestModuleCode";
        lStorage.set(key, moduleCode);
    }

    getLatestModuleCode() {
        var key = sessionStorage.uname+"-latestModuleCode";
        var value = lStorage.get(key);
        return value;
    }
}

$(function () {
    lStorage = {
        set: function (key, value) {
            window.localStorage.setItem( key, JSON.stringify(value) );
        },
        get: function (key) {
            try {
                return JSON.parse( window.localStorage.getItem(key) );
            } catch (e) {
                return null;
            }
        }
    };
    sStorage = {
        set: function (key, value) {
            window.sessionStorage.setItem( key, JSON.stringify(value) );
        },
        get: function (key) {
            try {
                return JSON.parse( window.sessionStorage.getItem(key) );
            } catch (e) {
                return null; 
            }
        }
    };

    storage = new Storage();
});

