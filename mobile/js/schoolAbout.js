class SchoolAbout {
    constructor() {

    }

    loadAnnouncements(data) {
        alert("called loadAnnouncements 1");
        let url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/StudentScheduleUI/getAnnouncements/${data}`;
        alert(`called loadAnnouncements 2`);
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        alert(`called loadAnnouncements 3`);
        let successFunction = function (data) {
            alert(`called loadAnnouncements 4 ${url} ${data}`);
            $("#announcementList").empty();
            $(data).each(function (index, obj) {
                let SchoolAnnouncementId = obj.getPropDefault("SchoolAnnouncementId", "--");
                let announcement = obj.getPropDefault("announcement", "--");
                let announcementDate = obj.getPropDefault("announcementDate", "--");
                let announcementUrl = obj.getPropDefault("announcementUrl", "--");
                let imageCss = "width: 444px; height: 350px;";
                let boxCss = "width: 500px;";
                let profileUrl = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
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
        alert(`called loadAnnouncements 5`);
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