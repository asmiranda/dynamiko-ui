class SchoolMobile {
    loadProfile() {
        let personObj = storage.get("PersonObj");
        console.log(personObj);
        if (personObj && personObj.firstName) {
            $(".box-welcome").hide();
            $(".box-profile").show();
            $("#myProfileName").html(personObj.getPropDefault("firstName", "--"))
        }
    }

    loadSchedules() {
        let url = "";
        if (loginJS.hasRole("Faculty")) {
            url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/FacultyScheduleUI/getSchedules`;
        }
        else {
            url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/StudentScheduleUI/getSchedules`;
        }
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            $(".my-module").show();
            $("#moduleList").empty();
            var boxBackGrounds = ['bg-aqua', 'bg-green', 'bg-yellow', 'bg-red', 'bg-aqua', 'bg-green', 'bg-yellow', 'bg-red', 'bg-aqua', 'bg-green', 'bg-yellow', 'bg-red'];
            $(data).each(function (index, obj) {
                let SchoolSchedule = obj.getPropDefault("SchoolSchedule", "--");
                let subjectName = obj.getPropDefault("name", "--");
                let sectionCode = obj.getPropDefault("sectionCode", "--");
                let startTime = obj.getPropDefault("startTime", "--");
                let endTime = obj.getPropDefault("endTime", "--");
                let nextColor = boxBackGrounds[index];
                let str = `
                    <div style="flex: 40%">
                        <!-- small box -->
                        <div class="small-box ${nextColor}" style="margin: 10px;">
                            <div class="inner">
                                <h3>${subjectName}</h3>
                                <p>${sectionCode} [${startTime} to ${endTime}]</p>
                            </div>
                            <div class="icon">
                                <i class="ion ion-bag"></i>
                            </div>
                            <a href="#" class="small-box-footer">Activities and Information <i class="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                `;
                $("#moduleList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadAnnouncements() {
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/pwidget/StudentScheduleUI/getAnnouncements`;
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
                    <div class="box box-solid">
                        <div class="box-header with-border">
                            <i class="fa fa-text-width"></i>

                            <h3 class="box-title">${announcementDate}</h3>
                        </div>
                        <div class="box-body">
                            <blockquote>
                                <p>${announcement}</p>
                                <small><a href="${announcementUrl}"><cite title="Source Title">Read more ${announcementUrl}</cite></a></small>
                            </blockquote>
                        </div>
                    </div>`;
                $("#announcementList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadData() {
        server = "10.0.2.2";
        MAIN_URL = `https://${server}:8888`;
        MAIN_SIGNAL_URL = `https://${server}:8888`;

        let token = utils.getUrlParamValue(window.location.href, "token");
        alert("token == " + token);
        if (!token || token == 'null') {
            $("#welcome").hide();
            $("#pleaseLogin").show();
        }
        else {
            loginJS.loadProfile(token, function () {
                $("#welcome").show();
                $("#pleaseLogin").hide();
                alert("load all");
            });
        }
    }
}

$(function () {
    schoolMobile = new SchoolMobile();
})