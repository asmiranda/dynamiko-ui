class FormLinker {
    constructor() {
    }

    init() {
        var context = this;
        $(".formLinker").click(function() {
            context.startLink(this);
        });
    }

    startLink(obj) {
        var linkModule = $(obj).attr("linkModule");
        var recordId = $(obj).attr("recordId");
        this.linkToForm(linkModule, recordId);
    }

    linkToForm(ui, recordId) {
        var moduleName = ui;
        var registerDatatable = new RegisterDatatable();
        registerDatatable.clearRegister();

        var constructForm = new MainForm(moduleName, '#searchTable[module="'+moduleName+'"]', '#mainForm[module="'+moduleName+'"]');
        constructForm.construct(recordId);

        var fileUpload = new FileUpload();
        fileUpload.initUpload();
    }
}