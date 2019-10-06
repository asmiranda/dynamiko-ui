class HrFormsWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("HrFormsWidget");

        this.loadTask();
    }

    loadTask() {
        var context = this;
        var url = MAIN_URL+'/api/generic/pwidget/HrFormsWidget/all';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $("#HrFormsWidgetList").empty();
            $(data).each(function(index, obj) {
                console.log(obj);
                var docId = obj.getProp("hrDocumentId");
                var icon = obj.getProp("icon");
                var title = obj.getProp("title");
                var shortDescription = obj.getProp("shortDescription");
                var description = obj.getProp("description");

                var str = `
                <strong><i class="${icon} margin-r-5"></i> ${title}
                <a class="cursor-pointer downloadHrForm" recId="${docId}">
                    <i class="fa fa-download"></i>
                </a>
                <p class="text-muted ml-5">
                    ${shortDescription}
                </p>
                `;
                $("#HrFormsWidgetList").append(str);
            });
            $(".downloadHrForm").click(function() {
                context.downloadForm(this);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    downloadForm(obj) {
        var recId = $(obj).attr("recId");
        var url = MAIN_URL+'/api/generic/pwidget/HrFormsWidget/getFile/'+recId;
        console.log(url);
        window.open(url, '_blank');
    }
}
