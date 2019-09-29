class Dashboard {
    constructor() {
    }

    load(moduleName) {
        console.log("load "+moduleName);
        var context = this;

        var url = MAIN_URL+"/api/ui/module/"+moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            $("#content-main").html(data);
            $('[data-mask]').inputmask();
            // context.controlButtonClass.initButtons();
            // context.searchTableClass.initTable();
            // context.fieldConstructor.initFields();
            // context.childTabs.initTabs();
            // context.moduleHelper.initHelp();
            // context.profilePicLoader.init();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }
}