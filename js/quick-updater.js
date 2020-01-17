class QuickUpdater {
    constructor() {
        var context = this;

        $(document).on('click', '.btnQuickAttachment', function() {
            context.quickAttachment(this);
        });
        $(document).on('click', '.btnQuickDownloader', function() {
            context.quickDownloader(this);
        });
        $(document).on('click', '.btnQuickUpdater', function() {
            context.quickUpdater(this);
        });
    }

    quickUpdater(obj) {
        var context = this;
        console.log("quickUpdater called");
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fieldName = $(obj).attr("fieldName");
        var updater = $(obj).attr("updater");

        if (updater=="calendar") {
        }
    }

    quickDownloader(obj) {
        var context = this;
        console.log("quickDownloader called");
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fileType = $(obj).attr("fileType");

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/QuickDownloader/${moduleName}/${recordId}/${fileType}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            window.open(MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/attachment/download/'+data, '_blank');
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet(); 
    }

    quickAttachment(obj) {
        var context = this;
        console.log("quickAttachment called");
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fileType = $(obj).attr("fileType");

        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Success", "File uploaded successfully!");
        };
        showUploadAttachment.show("File Uploader", moduleName, recordId, fileType, successCallback);
    }
}

$(function () {
    quickUpdater = new QuickUpdater();
});
