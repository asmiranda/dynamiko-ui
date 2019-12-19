class DynaButtonAction {
    constructor() {
        var context = this;
        this.mainForm = '#mainForm';
        $(document).on('click', '.btnChildTabSave', function() {
            context.saveChildRecord(this);
        });
    }

    saveChildRecord(myButton) {
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

        var url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/savesubrecord/${moduleName}/${submodule}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(tmp));
        var successCallback = function(data, status, hqr) {
            $(context.modalId).modal('hide');
            var moduleScript = new ModuleScript(moduleName);
            moduleScript.saveChild(submodule);
            var childTab = new ChildTab(moduleName, context.mainForm, submodule);
            childTab.reloadChildRecords();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

}


$(function () {
    var dynaButtonAction = new DynaButtonAction();
});
