class FormLinker {
    constructor() {
        var context = this;
        $(document).on('click', '.formLinker', function() {
            context.startLink(this);
        });
        $(document).on('click', '.childFormLinker', function() {
            context.startChildToFormLink(this);
        });
    }

    startChildToFormLink(obj) {
        var moduleName = $(obj).attr("module");
        var submodule = $(obj).attr("submodule");
        var recordId = $(obj).attr("mainId");
        var fieldname = $(obj).attr("fieldname");
        var childid = $(obj).attr("childid");
        this.linkChildToForm(moduleName, submodule, fieldname, recordId, childid);
    }

    linkChildToForm(moduleName, submodule, fieldname, recordId, childid) {
        var context = this;
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/childtoformlink/"+moduleName+"/"+submodule+"/"+fieldname+"/"+recordId+"/"+childid;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);

            var formModule = data.getProp("moduleName");
            var formId = data.getProp("recordId");
            context.linkToForm(formModule, formId);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    startLink(obj) {
        var linkModule = $(obj).attr("linkModule");
        var recordId = $(obj).attr("recordId");
        this.linkToForm(linkModule, recordId);
    }

    linkToForm(moduleName, recordId) {
        registerDatatable.clearRegister();

        constructMainForm.construct(moduleName, recordId);
        fileUpload.initUpload();
    }
}

$(function () {
    var formLinker = new FormLinker();
});
