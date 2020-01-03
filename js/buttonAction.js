class DynaButtonAction {
    constructor() {
        var context = this;
        this.mainForm = '#mainForm';
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

        var convertParent = new ConvertFormToJSON($(this.mainForm));
        var parentRecord = convertParent.convert();

        var convertRecord = new ConvertFormToJSON($(`form[addInfo='${addInfo}']`));
        var subRecord = convertRecord.convert();

        var tmp = [];
        tmp.push(parentRecord);
        tmp.push(subRecord);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/saveaddinfo/${moduleName}/${addInfo}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(tmp));
        var successCallback = function(data, status, hqr) {
            console.log(data);
            loadJsonToForm.load(context.mainForm, data);
            loadJsonToForm.loadAddInfo(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    saveDisplayTab(myButton) {
        var context = this;
        var moduleName = $(myButton).attr("module");
        var submodule = $(myButton).attr("submodule");
        console.log("Child Tab Save Button Called");

        var convertParent = new ConvertFormToJSON($(this.mainForm));
        var parentRecord = convertParent.convert();

        var convertRecord = new ConvertFormToJSON($(`form[submodule='${submodule}']`));
        var subRecord = convertRecord.convert();

        var tmp = [];
        tmp.push(parentRecord);
        tmp.push(subRecord);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/savesubrecord/${moduleName}/${submodule}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(tmp));
        var successCallback = function(data, status, hqr) {
            $(context.modalId).modal('hide');
            var moduleScript = new ModuleScript(moduleName);
            moduleScript.saveChild(submodule);
            var childTab = new ChildTab(moduleName, context.mainForm, submodule);
            childTab.reloadDisplayTabs();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };
}

$(function () {
    var dynaButtonAction = new DynaButtonAction();
});
