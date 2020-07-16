class SchoolAbout {
    constructor() {

    }

    loadAnnouncements(data) {
        alert("called loadAnnouncements 1");
        var context = this;
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/StudentScheduleUI/getAnnouncements/${data}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        alert(`called loadAnnouncements 2 ${url}`);
        var successFunction = function (data) {
            alert(`called loadAnnouncements 3 ${url} ${data}`);
            $("#announcementList").empty();
            $(data).each(function (index, obj) {
                var SchoolAnnouncementId = obj.getPropDefault("SchoolAnnouncementId", "--");
                var announcement = obj.getPropDefault("announcement", "--");
                var announcementDate = obj.getPropDefault("announcementDate", "--");
                var announcementUrl = obj.getPropDefault("announcementUrl", "--");
                var imageCss = "width: 444px; height: 350px;";
                var boxCss = "width: 500px;";
                var profileUrl = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
                var str = `
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
        alert(`called loadAnnouncements 4`);
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