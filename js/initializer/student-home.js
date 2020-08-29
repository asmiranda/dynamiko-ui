class StudentHome {
    initListeners() {
        console.log(`token = ${storage.getToken()}`);
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
        $(document).on('click', '.btnFullScreen', function () {
            context.btnFullScreen(this);
        });
        $(document).on('click', '.btnBook', function () {
            context.btnBook(this);
        });
        $(document).on('click', '.btnActivities', function () {
            context.btnActivities(this);
        });
        $(document).on('click', '.btnFacultyAndStudents', function () {
            context.btnFacultyAndStudents(this);
        });
        $(document).on('click', '.btnChat', function () {
            context.btnChat(this);
        });
    }

    btnChat() {
        $(`#moduleHeader`).show();
        $(`#activities`).hide();
        $(`#dailyRead`).hide();
        $(`#studentList`).hide();
        $(`#chatScreen`).show();
    }

    btnFacultyAndStudents() {
        $(`#moduleHeader`).show();
        $(`#activities`).hide();
        $(`#dailyRead`).hide();
        $(`#studentList`).show();
        $(`#chatScreen`).hide();
    }

    btnActivities() {
        $(`#moduleHeader`).show();
        $(`#activities`).show();
        $(`#dailyRead`).hide();
        $(`#chatScreen`).hide();
        $(`#activeVideo`).hide();
    }

    btnBook() {
        $(`#moduleHeader`).show();
        $(`#activities`).hide();
        $(`#dailyRead`).show();
        $(`#chatScreen`).hide();
        $(`#activeVideo`).hide();
    }

    btnFullScreen() {
        if (this.isFullscreen) {
            $(`#moduleHeader`).show();
            $(`#activities`).show();
            $(`#studentList`).hide();
            $(`#myModules`).show();

            $(`#meetingScreen`).show();
            $(`#remoteVideos`).show();
            $(`#activeVideo`).hide();

            this.isFullscreen = false;
        }
        else {
            $(`#moduleHeader`).hide();
            $(`#activities`).hide();
            $(`#studentList`).hide();
            $(`#myModules`).hide();
            $(`#dailyRead`).hide();
            $(`#chatScreen`).hide();
            $(`#dailyRead`).hide();

            $(`#meetingScreen`).show();
            $(`#remoteVideos`).show();
            $(`#activeVideo`).show();

            this.isFullscreen = true;
        }
    }

    btnLogout() {
        storage.clear();
        this.init();
    }

    btnCall(obj) {
        $(`#meetingScreen`).show();
        $(`#activities`).hide();

        //        alert("btn call");
        storage.setRoomCode(storage.getModuleCode());
        socketIOP2P.clearConnections();

        socketIOMediaStream.initVideo(function () {
            console.log("Local Media Started");
            socketIOMeetingRoom.init();
            socketIOMeetingRoom.join("Join Room", storage.getRoomCode());
        });
    }

    btnSchedule(obj) {
        let code = $(obj).attr("code");
        this.loadModuleDetail(code);
        this.loadActivities(code);
        this.loadStudents(code);
    }

    handleLogin() {
        let context = this;
        let uname = $("#email").val();
        let passw = $("#password").val();
        loginJS.login(uname, passw, function (data) {
            storage.setToken(data.Authorization);
            storage.getUname(uname);
            context.init();
        });
    }

    loadProfile() {
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/PersonUI/getProfile`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            console.log(data);
            storage.setProfileName(data.firstName);
            $("#myProfileName").html(storage.getProfileName());
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadSchedules() {
        let key = "schedules";
        let context = this;
        let cache_data = storage.get(key);
        if (cache_data) {
            context.arrangeSchedules(cache_data);
        }
        else {
            let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/getSchedule`;
            let ajaxRequestDTO = new AjaxRequestDTO(url, "");
            let successFunction = function (data) {
                storage.set(key, data);
                context.arrangeSchedules(data);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    arrangeSchedules(data) {
        console.log(data);
        $("#moduleList").empty();
        var boxBackGrounds = ['bg-aqua', 'bg-green', 'bg-yellow', 'bg-red', 'bg-aqua', 'bg-green', 'bg-yellow', 'bg-red', 'bg-aqua', 'bg-green', 'bg-yellow', 'bg-red'];
        $(data).each(function (index, obj) {
            let code = obj.getPropDefault("schoolScheduleCode", "--");
            let subjectName = obj.getPropDefault("subjectCode", "--");
            let startTime = obj.getPropDefault("startTime", "--");
            let endTime = obj.getPropDefault("endTime", "--");
            let nextColor = boxBackGrounds[index];
            storage.setModuleCode(code);
            storage.set(code, obj);
            let str = `
                <div style="flex: 1; min-width: 100px;">
                    <!-- small box -->
                    <div class="small-box ${nextColor} btnSchedule" style="margin: 10px;" code="${code}">
                        <div class="inner">
                            <span>${subjectName}</span>
                        </div>
                    </div>
                </div>
            `;
            $("#moduleList").append(str);
        });
        this.loadModuleDetail(storage.getModuleCode());
        this.loadActivities(storage.getModuleCode());
        this.loadStudents(storage.getModuleCode());
    }

    loadModuleDetail(scheduleCode) {
        let context = this;
        let cache_data = storage.get(scheduleCode);
        if (cache_data) {
            $("#moduleProfile").html(cache_data.subjectCode);
            let startTime = cache_data.startTime;
            let endTime = cache_data.endTime;

            $("#moduleProfileDetail").html(`( ${startTime}-${endTime} )`);
        }
    }

    loadStudents(scheduleCode) {
        let key = `students-${scheduleCode}`;
        let context = this;
        let cache_data = storage.get(key);
        if (cache_data) {
            context.arrangeStudents(cache_data);
        }
        else {
            let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/getStudents/${scheduleCode}`;
            let ajaxRequestDTO = new AjaxRequestDTO(url, "");

            let successFunction = function (data) {
                storage.set(key, data);
                context.arrangeStudents(data);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    arrangeStudents(data) {
        //        console.log("loadStudents", url, data);
        $("#studentImageRoster").empty();
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

            $("#studentImageRoster").append(str);
        });
        $(".studentCount").html(`${data.length} students`);
    }

    loadActivities(scheduleCode) {
        let key = `activities-${scheduleCode}`;
        let context = this;
        let cache_data = storage.get(key);
        if (cache_data) {
            context.arrangeActivities(cache_data);
        }
        else {
            let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/getActivities/${scheduleCode}`;
            let ajaxRequestDTO = new AjaxRequestDTO(url, "");

            let successFunction = function (data) {
                storage.set(key, data);
                context.arrangeActivities(data);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    arrangeActivities(data) {
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
    }

    init() {
        this.initListeners();
        if (storage.getToken() && storage.getToken().length > 20) {
            $("#loginScreen").hide();
            $("#welcome").show();

            this.loadProfile();
            this.loadSchedules();
        }
        else {
            $("#loginScreen").show();
            $("#welcome").hide();
        }
    }
}

$(function () {
    studentHome = new StudentHome();
})