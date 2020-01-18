class QuickUpdater {
    constructor() {
        var context = this;

        $(document).on('click', '.quickAttachmentTarget', function() {
            context.quickAttachment(this);
        });
        $(document).on('click', '.quickDownloaderTarget', function() {
            context.quickDownloader(this);
        });
        $(document).on('click', '.quickUpdaterTarget', function() {
            context.quickUpdater(this);
        });
        $(document).on('change', '.calendarQuickUpdaterInput', function() {
            context.quickUpdateInput(this);
        });
        $(document).on('change', '.textQuickUpdaterInput', function() {
            context.quickUpdateInput(this);
        });
        $(document).on('change', '.autoCompleteQuickUpdaterSelect', function() {
            context.quickAutoCompleteUpdateInput(this);
        });
    }

    quickAutoCompleteUpdateInput(obj) {
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fieldName = $(obj).attr("fieldName");
        var quickUpdaterId = $(obj).attr("quickUpdaterId");
        var value = $(obj).val();
        var textValue = obj.options[obj.selectedIndex].text;

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/QuickUpdater/${moduleName}/${recordId}/${fieldName}/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(`.quickUpdaterTarget[quickUpdaterId="${quickUpdaterId}"]`).html(textValue);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    quickUpdateInput(obj) {
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fieldName = $(obj).attr("fieldName");
        var quickUpdaterId = $(obj).attr("quickUpdaterId");
        var value = $(obj).val();

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/QuickUpdater/${moduleName}/${recordId}/${fieldName}/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(`.quickUpdaterTarget[quickUpdaterId="${quickUpdaterId}"]`).html(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    displayTextUpdate(obj) {
        this.displayInputUpdater(obj, "#textQuickUpdater", 'Please Type Below <a class="close" href="#">&times;</a>');
    }

    displayAutoCompleteUpdate(obj) {
        this.displayInputUpdater(obj, "#autoCompleteQuickUpdater", 'Please Type Below <a class="close" href="#">&times;</a>');
    }

    displayCalendarUpdate(obj) {
        this.displayInputUpdater(obj, "#calendarQuickUpdater", 'Choose Date <a class="close" href="#">&times;</a>');

        $('.calendar').datepicker({
            autoclose: true,
            format: config.getDateFormat()
        });
    }

    displayInputUpdater(obj, updaterId, updaterTitle) {
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fieldName = $(obj).attr("fieldName");
        var quickUpdaterId = $(obj).attr("quickUpdaterId");

        var str = $(updaterId).html();
        str = replaceStr.replaceAll(str, "##MODULE##", moduleName);
        str = replaceStr.replaceAll(str, "##RECORDID##", recordId);
        str = replaceStr.replaceAll(str, "##FIELDNAME##", fieldName);
        str = replaceStr.replaceAll(str, "##QUICKUPDATERID##", quickUpdaterId);

        console.log(str);
        var pop = $(obj);

        pop.popover({
            placement : 'right',
            trigger : 'manual',
            html : true,
            title : updaterTitle,
            content : str,
            sanitize : false,
        }).on('shown.bs.popover', function(e) {
            //console.log('shown triggered');
            // 'aria-describedby' is the id of the current popover
            var current_popover = '#' + $(e.target).attr('aria-describedby');
            var cur_pop = $(current_popover);
          
            cur_pop.find('.close').click(function(){
                //console.log('close triggered');
                pop.popover('hide');
            });
          
            cur_pop.find('.OK').click(function(){
                //console.log('OK triggered');
                pop.popover('hide');
            });
        });
        pop.popover('show');
    }

    quickUpdater(obj) {
        console.log("quickUpdater called");

        QUICK_UPDATER_COUNTER++;
        $(obj).attr("quickUpdaterId", QUICK_UPDATER_COUNTER);

        var updater = $(obj).attr("updater");
        if (updater=="calendar") {
            this.displayCalendarUpdate(obj);
        }
        else if (updater=="text") {
            this.displayTextUpdate(obj);
        }
        if (updater=="autoComplete") {
            this.displayAutoCompleteUpdate(obj);
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
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
    QUICK_UPDATER_COUNTER=0;
    quickUpdater = new QuickUpdater();   
});
