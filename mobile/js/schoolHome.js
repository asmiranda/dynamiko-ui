class SchoolHome extends AbstractMobile {
    loadSchedules(data) {
        let url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/StudentScheduleUI/getAnnouncements/${data}`;
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
                let profileUrl = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
                let str = `
                    <div class="box box-solid">
                        <div class="box-header with-border">
                            <i class="fa fa-text-width"></i>

                            <h3 class="box-title">${announcementDate}</h3>
                        </div>
                        <div class="box-body">
                            <blockquote>
                                <p>${announcement}</p>
                                <small>Read more <a href="${announcementUrl}"><cite title="Source Title">${announcementUrl}</cite></a></small>
                            </blockquote>
                        </div>
                    </div>`;
                $("#announcementList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadAnnouncements(data) {
        let url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/StudentScheduleUI/getAnnouncements/${data}`;
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
                let profileUrl = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
                let str = `
                    <div class="box box-solid">
                        <div class="box-header with-border">
                            <i class="fa fa-text-width"></i>

                            <h3 class="box-title">${announcementDate}</h3>
                        </div>
                        <div class="box-body">
                            <blockquote>
                                <p>${announcement}</p>
                                <small>Read more <a href="${announcementUrl}"><cite title="Source Title">${announcementUrl}</cite></a></small>
                            </blockquote>
                        </div>
                    </div>`;
                $("#announcementList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    onReactMessage(data) {
        config.loadProfile(data);
        this.loadAnnouncements("");
    }
}

$(function () {
    schoolHome = new SchoolHome();
})