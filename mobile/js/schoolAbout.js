class SchoolAbout {
    constructor() {

    }

    loadAnnouncements(data) {
        let url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/StudentScheduleUI/getAnnouncements/${data}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            $("#announcementList").empty();
            $(data).each(function (index, obj) {
                alert(`called loadAnnouncements 11`);
                let SchoolAnnouncementId = obj.getPropDefault("SchoolAnnouncementId", "--");
                alert(`called loadAnnouncements 12`);
                let announcement = obj.getPropDefault("announcement", "--");
                alert(`called loadAnnouncements 13`);
                let announcementDate = obj.getPropDefault("announcementDate", "--");
                alert(`called loadAnnouncements 14`);
                let announcementUrl = obj.getPropDefault("announcementUrl", "--");
                alert(`called loadAnnouncements 15`);
                let imageCss = "width: 444px; height: 350px;";
                alert(`called loadAnnouncements 16`);
                let boxCss = "width: 500px;";
                alert(`called loadAnnouncements 17`);
                let profileUrl = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
                alert(`called loadAnnouncements 18`);
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
                alert(`called loadAnnouncements 19`);
                $("#announcementList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    onReactMessage(data) {
        document.getElementById("mobileResponse").innerHTML = data;
        sessionStorage.companyCode = "TEST";
        sessionStorage.token = data;
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