class HrDocumentsWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("HrDocumentsWidget");

        this.loadTask();
    }

    loadTask() {
        var context = this;
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/pwidget/HrDocumentsWidget/all';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $("#HrDocumentsWidgetList").empty();
            $(data).each(function(index, obj) {
                console.log(obj);
                var docId = obj.getProp("hrDocumentId");
                var icon = obj.getProp("icon");
                var title = obj.getProp("title");
                var shortDescription = obj.getProp("shortDescription");
                var description = obj.getProp("description");

                var str = `
                <strong><i class="${icon} margin-r-5"></i> ${title}
                <a class="cursor-pointer showHrDocument" recId="${docId}">
                    <i class="fa fa-location-arrow"></i>
                </a>
                <p class="text-muted ml-5">
                    ${shortDescription}
                </p>
                `;
                $("#HrDocumentsWidgetList").append(str);
            });
            $(".showHrDocument").click(function() {
                context.showHrDocument(this);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    showHrDocument(obj) {
        var recId = $(obj).attr("recId");
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/pwidget/HrDocumentsWidget/showHrDocument/'+recId;
        console.log(url);
    }
}
