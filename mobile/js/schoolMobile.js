class SchoolMobile {
    constructor() {
        console.log(`token = ${mobileUtil.getToken()}`);
        server = "service.dynamikosoft.com";
        MAIN_URL = `https://${server}:8888`;
        MAIN_SIGNAL_URL = `https://${server}:8888`;

        let context = this;
        $(document).on('click', '#btnShowLogin', function () {
            $("#loginScreen").show();
        });
        $(document).on('click', '#btnLogin', function () {
            context.handleLogin();
        });
        $(document).on('click', '.btnSchedule', function () {
            context.btnSchedule(this);
        });
        $(document).on('click', '.btnCall', function () {
            context.btnCall(this);
        });
        $(document).on('click', '.btnShowProfile', function () {
            context.btnShowProfile(this);
        });
        $(document).on('click', '.btnLogout', function () {
            context.btnLogout(this);
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

    btnLogout() {
        $("#loginScreen").show();
    }

    btnShowProfile() {

    }

    btnCall(obj) {
        let confCode = $(obj).attr("code");
        mobileStorage.roomCode = confCode;
        mobileSocketIOMeetingRoom.join("Join Room", confCode);
    }

    btnSchedule(obj) {
        let code = $(obj).attr("code");
        this.loadActivities(code);
        this.loadStudents(code);
    }

    handleLogin() {
        let context = this;
        let uname = $("#email").val();
        let passw = $("#password").val();
        mobileLogin.login(uname, passw, function (data) {
            mobileStorage.token = data.Authorization;
            mobileStorage.uname = uname;
            console.log("Sending Token to Android.")
            Android.sendToken(mobileStorage.token);
            context.loadProfile();
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
        let url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/widget/SchoolUI/getSchedule`;
        let context = this;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            console.log(data);
            $(".my-module").show();
            $("#moduleList").empty();
            var boxBackGrounds = ['bg-aqua', 'bg-green', 'bg-yellow', 'bg-red', 'bg-aqua', 'bg-green', 'bg-yellow', 'bg-red', 'bg-aqua', 'bg-green', 'bg-yellow', 'bg-red'];
            $(data).each(function (index, obj) {
                let code = obj.getPropDefault("schoolScheduleCode", "--");
                let subjectName = obj.getPropDefault("subjectCode", "--");
                let startTime = obj.getPropDefault("startTime", "--");
                let endTime = obj.getPropDefault("endTime", "--");
                let nextColor = boxBackGrounds[index];
                mobileStorage.moduleCode = code;
                let str = `
                    <div style="flex: 40%">
                        <!-- small box -->
                        <div class="small-box ${nextColor}" style="margin: 10px;">
                            <div class="inner">
                                <h3>${subjectName}</h3>
                                <p>${startTime} to ${endTime}</p>
                                <p><i class="fa fa-phone btnCall" style="margin-left: 10px; font-size: x-large;" code="${code}"></i></p>
                            </div>
                            <div class="icon">
                                <i class="ion ion-bag"></i>
                            </div>
                            <a href="#" class="small-box-footer btnSchedule" code="${code}">Activities <i class="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                `;
                $("#moduleList").append(str);
            });
            context.loadActivities(mobileStorage.moduleCode);
            context.loadStudents(mobileStorage.moduleCode);
        };
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadStudents(scheduleCode) {
        utils.showSpin();
        let context = this;
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/getStudents/${scheduleCode}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let successFunction = function (data) {
            console.log("loadStudents", url, data);
            $(".studentImageRoster").empty();
            $(data).each(function (index, obj) {
                let code = obj.getPropDefault("code", "--");
                let profileUrl = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/profilePic/PersonUI/${code}`;
                let fullName = `${obj.getPropDefault("firstName", "--")} ${obj.getPropDefault("lastName", "--")}`;
                let birthDate = `${obj.getPropDefault("birthDate", "--")}`;
                let str = `
                    <li>
                        <img src="${profileUrl}" alt="User Image">
                        <a class="users-list-name" href="#">${fullName}</a>
                        <span class="users-list-date">${birthDate}</span>
                    </li>
                `;

                $(".studentImageRoster").append(str);
            });
            $(".studentCount").html(`${data.length} students`);
            utils.hideSpin();
        };
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadActivities(scheduleCode) {
        utils.showSpin();
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/getActivities/${scheduleCode}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let successFunction = function (data) {
            console.log("loadActivities", url, data);
            $(".ActivityList").empty();
            $(data).each(function (index, obj) {
                let SchoolScheduleTaskId = obj.getPropDefault("SchoolScheduleTaskId", "");
                let startDate = obj.getPropDefault("taskDate", "");
                let endDate = obj.getPropDefault("endDate", "");
                let taskType = obj.getPropDefault("taskType", "");
                let detail = obj.getPropDefault("detail", "");
                let str = `
                    <li>
                        <i class="fa fa-fw fa-gear bg-blue"></i>
                        <div class="timeline-item">
                            <span class="time"><i class="fa fa-clock-o"></i> till ${endDate}</span>
                            <h3 class="timeline-header"><a href="#">${taskType}</a></h3>
                            <div class="timeline-body">
                                ${detail}
                            </div>
                        </div>
                    </li>
                `;
                $(".ActivityList").append(str);
                utils.hideSpin();
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
        }
    }

    sendToken(token) {
        console.log(`token = ${token}`);
        alert("received token - " + token);
        if (token) {
            mobileStorage.token = token;
            this.loadProfile();
        }
    }
}

$(function () {
    schoolMobile = new SchoolMobile();
    Android.loadComplete();
})
