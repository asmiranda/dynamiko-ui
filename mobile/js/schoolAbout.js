class SchoolAbout {
    constructor() {

    }

    loadAnnouncements(data) {
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/StudentScheduleUI/getAnnouncements/${data}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            $("#announcementList").empty();
            $(data).each(function (index, obj) {
                let SchoolAnnouncementId = obj.getPropDefault("SchoolAnnouncementId", "--");
                let announcement = obj.getPropDefault("announcement", "--");
                let announcementDate = obj.getPropDefault("announcementDate", "--");
                let announcementUrl = obj.getPropDefault("announcementUrl", "--");
                let imageCss = "width: 444px; height: 350px;";
                let boxCss = "width: 500px;";
                let profileUrl = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
                let str = `
                    <div class="box box-widget" style="margin: 15px; ${boxCss}">
                        <div class="box-body">
                            <img class="img-responsive pad" src="${profileUrl}" alt="Photo" style="${imageCss}">

                            <p style="padding: 20px;">${announcementDate} - ${announcement}</p>
                        </div>
                        <div class="box-footer box-comments">
                            <a href="${announcementUrl}" target="_blank" class="btn btn-default btn-xs"><i class="fa fa-share"></i> Read More</a>
                        </div>
                    </div>
                `;
                $("#announcementList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    onReactMessage(data) {
        storage.getCompanyCode() = "TEST";
        storage.getToken() = data;
        this.loadAnnouncements("");
    }

    init() {
        let context = this;
        window.ReactNativeWebView.postMessage("Loaded");

        window.addEventListener("message", message => {
            context.onReactMessage(message.data);
        });
    }
}

$(function () {
    schoolAbout = new SchoolAbout();
})