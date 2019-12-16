class FormLinker {
    constructor() {
    }

    init() {
        var context = this;
        $(".formLinker").click(function() {
            context.startLink(this);
        });
        $(".childFormLinker").click(function() {
            context.startChildToFormLink(this);
        });
    }

    startChildToFormLink(obj) {
        var moduleName = $(obj).attr("module");
        var submodule = $(obj).attr("submodule");
        var mainId = $(obj).attr("mainId");
        var fieldname = $(obj).attr("fieldname");
        var childid = $(obj).attr("childid");
        this.linkChildToForm(moduleName, submodule, fieldname, mainId, childid);
    }

    linkChildToForm(moduleName, submodule, fieldname, mainId, childid) {
        var context = this;
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/childtoformlink/"+moduleName+"/"+submodule+"/"+fieldname+"/"+mainId+"/"+childid;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);

            var formModule = data.getProp("moduleName");
            var formId = data.getProp("recordId");
            context.linkToForm(formModule, formId);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    startLink(obj) {
        var linkModule = $(obj).attr("linkModule");
        var recordId = $(obj).attr("recordId");
        this.linkToForm(linkModule, recordId);
    }

    linkToForm(moduleName, recordId) {
        var registerDatatable = new RegisterDatatable();
        registerDatatable.clearRegister();

        var constructForm = new MainForm(moduleName, '#searchTable[module="'+moduleName+'"]', '#mainForm[module="'+moduleName+'"]');
        constructForm.construct(recordId);

        var fileUpload = new FileUpload();
        fileUpload.initUpload();
    }
}