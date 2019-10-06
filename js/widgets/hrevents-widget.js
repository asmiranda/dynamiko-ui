class HrEventsWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("HrEventsWidget");

        this.loadTask();
    }

    loadTask() {
        var context = this;
        var url = MAIN_URL+'/api/generic/pwidget/HrEventsWidget/all';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $("#HrEventsWidgetList").empty();
            $(data).each(function(index, obj) {
                console.log(obj);
                var docId = obj.getProp("hrDocumentId");
                var icon = obj.getProp("icon");
                var title = obj.getProp("title");
                var shortDescription = obj.getProp("shortDescription");
                var description = obj.getProp("description");

                var str = `
                <strong><i class="${icon} margin-r-5"></i> ${title}
                <a class="cursor-pointer showHrEvent" recId="${docId}">
                    <i class="fa fa-download"></i>
                </a>
                <p class="text-muted ml-5">
                    ${shortDescription}
                </p>
                `;
                $("#HrEventsWidgetList").append(str);
            });
            $(".showHrEvent").click(function() {
                context.showHrEvent(this);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    showHrEvent(obj) {
        var recId = $(obj).attr("recId");
        var url = MAIN_URL+'/api/generic/pwidget/HrEventsWidget/showHrEvent/'+recId;
        console.log(url);
    }
}
