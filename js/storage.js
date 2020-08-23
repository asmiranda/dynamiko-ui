class Storage {
    constructor() {
        this.myStorage = window.localStorage;
        // this.myStorage = window.sessionStorage;
    }

    clear() {
        this.myStorage.clear();
    }

    setRoomCode(roomCode) {
        return this.myStorage.roomCode = roomCode;
    }
    getRoomCode() {
        return this.myStorage.roomCode;
    }

    setProfileName(profileName) {
        return this.myStorage.profileName = profileName;
    }
    getProfileName() {
        return this.myStorage.profileName;
    }

    setUname(uname) {
        return this.myStorage.uname = uname;
    }
    getUname() {
        return this.myStorage.uname;
    }

    setToken(token) {
        this.myStorage.token = token;
    }
    getToken() {
        return this.myStorage.token;
    }

    setCompanyCode(companyCode) {
        this.myStorage.companyCode = companyCode;
    }
    getCompanyCode() {
        return this.myStorage.companyCode;
    }

    storeAccountToken(uname, data) {
        this.myStorage.uname = uname;
        this.myStorage.token = data.token;
        this.myStorage.companyCode = data.companyCode;
    }

    setModule(moduleName) {
        this.myStorage.latestModule = moduleName;
    }

    getModule() {
        return this.myStorage.latestModule;
    }

    setModuleId(moduleId) {
        this.myStorage.moduleId = moduleId;
    }

    getModuleId() {
        return this.myStorage.moduleId;
    }

    setModuleCode(moduleCode) {
        this.myStorage.moduleCode = moduleCode;
    }

    getModuleCode() {
        return this.myStorage.moduleCode;
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

