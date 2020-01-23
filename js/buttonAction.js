class DynaButtonAction {
    constructor() {
        var context = this;
        $(document).on('click', '.btnChildTabSave', function() {
            context.saveDisplayTab(this);
        });
        $(document).on('click', '.btnAddInfoSave', function() {
            context.saveAddInfoSave(this);
        });
    }

    saveAddInfoSave(myButton) {
        var context = this;
        var moduleName = $(myButton).attr("module");
        var addInfo = $(myButton).attr("addInfo");
        console.log("Child Tab Save Button Called");

        var parentRecord = utils.convertFormToJSON($(mainForm));
        var subRecord = utils.convertFormToJSON($(`form[addInfo='${addInfo}']`));

        var tmp = [];
        tmp.push(parentRecord);
        tmp.push(subRecord);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/saveaddinfo/${moduleName}/${addInfo}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(tmp));
        var successCallback = function(data, status, hqr) {
            console.log(data);
            utils.loadJsonToForm(mainForm, data);
            utils.loadJsonAddInfo(data);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    };

    saveDisplayTab(myButton) {
        var context = this;
        var moduleName = $(myButton).attr("module");
        var submodule = $(myButton).attr("submodule");
        console.log("Child Tab Save Button Called");

        var parentRecord = utils.convertFormToJSON($(mainForm));
        var subRecord = utils.convertFormToJSON($(`form[submodule='${submodule}']`));

        var tmp = [];
        tmp.push(parentRecord);
        tmp.push(subRecord);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/savesubrecord/${moduleName}/${submodule}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(tmp));
        var successCallback = function(data, status, hqr) {
            $(context.modalId).modal('hide');
            var moduleScript = new ModuleScript(moduleName);
            moduleScript.saveChild(submodule);
            var childTab = new ChildTab(moduleName, submodule);
            childTab.reloadDisplayTabs();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    };
}

$(function () {
    dynaButtonAction = new DynaButtonAction();
});
