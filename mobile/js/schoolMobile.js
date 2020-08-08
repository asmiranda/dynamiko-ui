class SchoolMobile {
    constructor() {
        // server = "10.0.2.2";
        server = "localhost";
        MAIN_URL = `https://${server}:8888`;
        MAIN_SIGNAL_URL = `https://${server}:8888`;

        // alert("SchoolMobile");
        let context = this;
        $(document).on('click', '#btnShowLogin', function () {
            $("#loginScreen").show();
        });
        $(document).on('click', '#btnLogin', function () {
            context.handleLogin();
        });
        window.addEventListener("message", message => {
            mobileStorage.token = message.data;
            $("#loginScreen").hide();
            $("#pleaseLogin").hide();

            mobileLogin.loadProfile(mobileStorage.token, function () {
                $("#welcome").show();
            });
        });
    }

    handleLogin() {
        let context = this;
        let uname = $("#email").val();
        let passw = $("#password").val();
        uname = "faculty1@test.com";
        passw = "password";
        mobileLogin.login(uname, passw, function (data) {
            mobileStorage.token = data.Authorization;
            context.updateDisplay();
        });
    }

    loadProfile() {
        let url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/widget/PersonUI/getProfile`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            console.log(data);
            $("#myProfileName").html(data.firstName);
            $("#loginScreen").hide();
            $("#pleaseLogin").hide();
        };
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadSchedules() {
        let url = "";
        if (mobileLogin.hasRole("Faculty")) {
            url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/widget/FacultyScheduleUI/getSchedules`;
        }
        else {
            url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/widget/StudentScheduleUI/getSchedules`;
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
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadActivities() {
        let url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/pwidget/StudentScheduleUI/getAnnouncements`;
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
                let profileUrl = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
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
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadStudents() {
        let url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/pwidget/StudentScheduleUI/getAnnouncements`;
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
                let profileUrl = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
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
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    updateDisplay() {
        if (mobileStorage.token) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(mobileStorage.token);
            }
            this.loadProfile();
            this.loadSchedules();
            // this.loadActivities();
            // this.loadStudents();
        }
    }

    loadDisplay() {
        if (window.ReactNativeWebView) {
            $("#loginScreen").hide();
            $("#pleaseLogin").hide();
        }
        else {

        }
    }
}

$(function () {
    schoolMobile = new SchoolMobile();
})