class SchoolMobile {
    constructor() {
        console.log(`token = ${mobileUtil.getToken()}`);

        let context = this;
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
            mobileLogin.loadProfile(mobileStorage.token, function () {
                $("#welcome").show();
            });
        });

    }

    btnLogout() {
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
        };
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadSchedules() {
        let url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/widget/SchoolUI/getSchedule`;
        let context = this;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            console.log(data);
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
        let context = this;
        let url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/widget/SchoolUI/getStudents/${scheduleCode}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let successFunction = function (data) {
            console.log("loadStudents", url, data);
            $("#studentImageRoster").empty();
            $(data).each(function (index, obj) {
                let code = obj.getPropDefault("code", "--");
                let profileUrl = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/profilePic/PersonUI/${code}`;
                let fullName = `${obj.getPropDefault("firstName", "--")} ${obj.getPropDefault("lastName", "--")}`;
                let birthDate = `${obj.getPropDefault("birthDate", "--")}`;
                let str = `
                    <li>
                        <img src="${profileUrl}" alt="User Image">
                        <a class="users-list-name" href="#">${fullName}</a>
                        <span class="users-list-date">${birthDate}</span>
                    </li>
                `;

                $("#studentImageRoster").append(str);
            });
            $(".studentCount").html(`${data.length} students`);
        };
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadActivities(scheduleCode) {
        let url = `${MAIN_URL}/api/generic/${mobileStorage.companyCode}/widget/SchoolUI/getActivities/${scheduleCode}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let successFunction = function (data) {
            console.log("loadActivities", url, data);
            $("#ActivityList").empty();
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
                $("#ActivityList").append(str);
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
        let locationRef = window.location.href
        if (locationRef.includes("schoolAccount.html")) {
            if (token.length > 20) {
                mobileStorage.token = token;
                $("#welcome").show();
                this.loadProfile();
            }
            else {
                $("#welcome").hide();
            }
        }
        else if (locationRef.includes("schoolSchedules.html")) {
            if (token.length > 20) {
                mobileStorage.token = token;
                $("#pleaseLogin").hide();
                $("#myModules").show();
                this.loadSchedules();
            }
            else {
                $("#pleaseLogin").show();
                $("#myModules").hide();
            }
        }
        else if (locationRef.includes("schoolActivities.html")) {
            if (token.length > 20) {
                mobileStorage.token = token;
                $("#pleaseLogin").hide();
                $("#activitiesList").show();
                this.loadActivities();
            }
            else {
                $("#pleaseLogin").show();
                $("#activitiesList").hide();
            }
        }
        else if (locationRef.includes("schoolStudents.html")) {
            if (token.length > 20) {
                mobileStorage.token = token;
                $("#pleaseLogin").hide();
                $("#studentsList").show();
                this.loadStudents();
            }
            else {
                $("#pleaseLogin").show();
                $("#studentsList").hide();
            }
        }
    }
}

$(function () {
    schoolMobile = new SchoolMobile();
    Android.loadComplete();
})
