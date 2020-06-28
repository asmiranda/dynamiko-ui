class AbstractUI {
    changeMainId(obj) {
    }

    doMainSearchData(evt) {
    }

    changeModule(evt) {
        console.log("testing");
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }
    
    loadedCallback(data) {
        console.log("loadedCallback not implemented.")
    }
}
