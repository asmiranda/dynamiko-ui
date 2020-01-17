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
        $(document).on('change', '.calendarQuickUpdaterInput', function() {
            context.quickUpdateCalendarInput(this);
        });
    }

    quickUpdateCalendarInput(obj) {
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fieldName = $(obj).attr("fieldName");
        var quickUpdaterId = $(obj).attr("quickUpdaterId");
        var value = $(obj).val();

        console.log(moduleName);
        console.log(recordId);
        console.log(fieldName);
        console.log(quickUpdaterId);
        console.log(value);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/QuickUpdater/${moduleName}/${recordId}/${fieldName}/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(`[quickUpdaterId="${quickUpdaterId}"]`).html(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet(); 
    }

    quickUpdater(obj) {
        var context = this;
        QUICK_UPDATER_COUNTER++;
        console.log("quickUpdater called");
        var moduleName = $(obj).attr("module");
        var recordId = $(obj).attr("recordId");
        var fieldName = $(obj).attr("fieldName");
        var updater = $(obj).attr("updater");
        $(obj).attr("quickUpdaterId", QUICK_UPDATER_COUNTER);

        if (updater=="calendar") {
            var str = $("#calendarQuickUpdater").html();
            str = replaceStr.replaceAll(str, "##MODULE##", moduleName);
            str = replaceStr.replaceAll(str, "##RECORDID##", recordId);
            str = replaceStr.replaceAll(str, "##FIELDNAME##", fieldName);
            str = replaceStr.replaceAll(str, "##QUICKUPDATERID##", QUICK_UPDATER_COUNTER);

            console.log(str);
            var $pop = $(obj);

            $pop.popover({
                placement : 'right',
                trigger : 'manual',
                html : true,
                title : 'Choose Date <a class="close" href="#">&times;</a>',
                content : str,
                sanitize : false,
            }).on('shown.bs.popover', function(e) {
                //console.log('shown triggered');
                // 'aria-describedby' is the id of the current popover
                var current_popover = '#' + $(e.target).attr('aria-describedby');
                var $cur_pop = $(current_popover);
              
                $cur_pop.find('.close').click(function(){
                    //console.log('close triggered');
                    $pop.popover('hide');
                });
              
                $cur_pop.find('.OK').click(function(){
                    //console.log('OK triggered');
                    $pop.popover('hide');
                });
            });
            $pop.popover('show');
            $('.calendar').datepicker({
                autoclose: true,
                format: config.getDateFormat()
            });
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
    QUICK_UPDATER_COUNTER=0;
    quickUpdater = new QuickUpdater();   
});
