class FormLinker {
    constructor() {

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