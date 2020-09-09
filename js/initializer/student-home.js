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
        $(document).on('click', '.btnEndCall', function () {
            context.btnEndCall(this);
        });
        $(document).on('click', '.btnSaveNetworkBandwidth', function () {
            context.btnSaveNetworkBandwidth(this);
        });
        $(document).on('click', '.btnAddVideo', function () {
            context.btnAddVideo(this);
        });
        $(document).on('click', '.btnRemoveVideo', function () {
            context.btnRemoveVideo(this);
        });
        $(document).on('click', '.btnMute', function () {
            context.btnMute(this);
        });
        $(document).on('click', '.btnUnmute', function () {
            context.btnUnmute(this);
        });
        $(document).on('click', '.btnSendChatMessage', function () {
            context.btnSendChatMessage(this);
        });
        $(document).on('dataChannelMessageReceived', function () {
            context.dataChannelMessageReceived(event);
        });
        $(document).on('click', '.btnHideChatScreen', function () {
            context.btnHideChatScreen(event);
        });
        $(document).on('click', '.btnScreenSharing', function () {
            console.log("on click btnScreenSharing")
            context.btnScreenSharing(event);
        });
        $(document).on('click', '.miniVideoStream', function () {
            context.displaySelectedVideo(this);
        });
        $(document).on('click', '.remoteMiniVideoStream', function () {
            context.displaySelectedVideo(this);
        });
    }

    displaySelectedVideo(obj) {
        $(`#meetingScreen`).show();
        $(`#activities`).hide();
        $(`#myVideo`).show();
        $(`#myVideoActionButtons`).show();

        // $(`.btnAddVideo`).show();
        $(`.btnRemoveVideo`).show();
        // $(`.btnUnmute`).show();
        $(`.btnMute`).show();
        $(`.btnFullScreen`).show();

        $(`#activeVideo`).show();
        $(`#meetingScreen`).show();
        $(`#remoteVideos`).show();
        $(`.btnChat`).show();
        $(`#chatScreen`).hide();

        let activeVideo = document.getElementById("activeVideo")
        activeVideo.srcObject = obj.srcObject
    }

    btnScreenSharing() {
        console.log("btnScreenSharing")
        socketIOP2P.shareScreen();
    }

    btnHideChatScreen() {
        $("#chatScreen").hide();
    }

    dataChannelMessageReceived(evt) {
        let message = evt.detail.data;
        let obj = JSON.parse(message);
        if (obj.dataType == 'Chat') {
            this.handleChatMessage(obj);
        }
        else if (obj.dataType == 'SaveMode') {
            this.handleRemoteSaveMode(obj);
        }
        else if (obj.dataType == 'UnsaveMode') {
            this.handleRemoteUnsaveMode(obj);
        }
        else if (obj.dataType == 'LoadWebinar') {
            this.handleLoadWebinar(obj);
        }
        else if (obj.dataType == 'UnloadWebinar') {
            this.handleUnloadWebinar(obj);
        }
        else if (obj.dataType == 'ShareScreen') {
            this.handleShareScreen(obj);
        }
        else if (obj.dataType == 'UnshareScreen') {
            this.handleUnshareScreen(obj);
        }
    }

    handleShareScreen(obj) {
        socketIOP2P.handleShareScreen(obj);
    }

    handleUnshareScreen(obj) {
        socketIOP2P.handleUnshareScreen(obj);
    }

    handleLoadWebinar(obj) {
        socketIOP2P.handleLoadWebinar(obj);
    }

    handleUnloadWebinar(obj) {
        socketIOP2P.handleUnloadWebinar(obj);
    }

    handleRemoteUnsaveMode(obj) {
        socketIOP2P.handleRemoteUnsaveMode()
    }

    handleRemoteSaveMode(obj) {
        socketIOP2P.handleRemoteSaveMode()
    }

    handleChatMessage(obj) {
        let remoteProfile = obj.profileName;
        let messageStr = obj.message;
        let str = `
            <div style="width: 100%;">
                <a href="#" class="name">${remoteProfile}</a>
                <p class="message">${messageStr}</p>
            </div>
        `;
        console.log(str);
        $("#chatBox").append(str);
    }

    btnSendChatMessage(obj) {
        let chatUser = $("#selectChatUser").val();
        let chatMessage = $("#txtChatMessage").val();

        let str = `
            <div style="width: 100%;">
                <p class="message" style="color:#767dcd">${chatMessage}</p>
            </div>
        `;
        $("#chatBox").append(str);

        socketIOP2P.sendChatMessage(chatUser, chatMessage);
    }

    btnMute() {
        socketIOMediaStream.localVideo.getAudioTracks()[0].enabled = false;
        // $(`.btnAddVideo`).hide();
        // $(`.btnRemoveVideo`).hide();
        $(`.btnUnmute`).show();
        $(`.btnMute`).hide();
    }

    btnUnmute() {
        socketIOMediaStream.localVideo.getAudioTracks()[0].enabled = true;
        // $(`.btnAddVideo`).hide();
        // $(`.btnRemoveVideo`).hide();
        $(`.btnUnmute`).hide();
        $(`.btnMute`).show();
    }

    btnAddVideo() {
        socketIOMediaStream.localVideo.getVideoTracks()[0].enabled = true;
        $(`.btnAddVideo`).hide();
        $(`.btnRemoveVideo`).show();
        // $(`.btnUnmute`).hide();
        // $(`.btnMute`).hide();

        $(`#myVideo`).show();
        $(`#myVideoActionButtons`).show();
    }

    btnRemoveVideo() {
        socketIOMediaStream.localVideo.getVideoTracks()[0].enabled = false;
        $(`.btnAddVideo`).show();
        $(`.btnRemoveVideo`).hide();
        // $(`.btnUnmute`).hide();
        // $(`.btnMute`).hide();

        $(`#myVideo`).hide();
        $(`#myVideoActionButtons`).hide();
    }

    btnCall(obj) {
        $(`#meetingScreen`).show();
        $(`#activities`).hide();
        $(`#myVideo`).show();
        $(`#myVideoActionButtons`).show();

        // $(`.btnAddVideo`).show();
        $(`.btnRemoveVideo`).show();
        // $(`.btnUnmute`).show();
        $(`.btnMute`).show();
        $(`.btnFullScreen`).show();

        $(`#activeVideo`).show();
        $(`#meetingScreen`).show();
        $(`#remoteVideos`).show();
        $(`.btnChat`).show();

        storage.setRoomCode(storage.getModuleCode());
        socketIOP2P.clearConnections();

        socketIOMediaStream.initVideo(function () {
            console.log("Local Media Started");
            socketIOMeetingRoom.init();
            socketIOMeetingRoom.join("Join Room", storage.getRoomCode());
        });
        this.onCall = true;
    }

    btnEndCall() {
        $(`#moduleHeader`).show();
        $(`#activities`).show();
        $(`#dailyRead`).hide();
        $(`#chatScreen`).hide();
        $(`#activeVideo`).hide();
        $(`#meetingScreen`).hide();
        $(`#remoteVideos`).hide();
        $(`#myModules`).show();

        $(`#myVideo`).hide();
        $(`#myVideoActionButtons`).hide();

        $(`.btnAddVideo`).hide();
        $(`.btnRemoveVideo`).hide();
        $(`.btnUnmute`).hide();
        $(`.btnMute`).hide();
        $(`.btnFullScreen`).hide();
        $(`.btnChat`).hide();
        $(`#chatScreen`).hide();
        this.onCall = false;
        socketIOMediaStream.localVideo.getVideoTracks()[0].stop();
        socketIOMediaStream.localVideo.getAudioTracks()[0].stop();
    }

    btnSaveNetworkBandwidth() {
        if (this.saveMode) {
            socketIOP2P.unsaveBandWidth();
            this.saveMode = false;
        }
        else {
            var r = confirm("Power and network bandwidth saving mode?");
            if (r) {
                socketIOP2P.saveBandWidth();
            }
            this.saveMode = true;
        }
    }

    btnChat() {
        $(`#moduleHeader`).show();
        $(`#activities`).hide();
        $(`#dailyRead`).hide();
        $(`#studentList`).hide();
        $(`#chatScreen`).show();
        $(`#studentList`).hide();
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
        $(`#studentList`).hide();
    }

    btnBook() {
        $(`#moduleHeader`).show();
        $(`#activities`).hide();
        $(`#dailyRead`).show();
        $(`#chatScreen`).hide();
        $(`#activeVideo`).hide();
        $(`#studentList`).hide();
    }

    btnFullScreen() {
        if (!this.onCall) {
            $(`#myVideo`).hide();
            $(`#myVideoActionButtons`).hide();
            $(`#activeVideo`).hide();
            return;
        }
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
        window.location.href = "loginNoRedirect.html";
    }

    btnSchedule(obj) {
        let code = $(obj).attr("code");
        storage.setModuleCode(code);
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
        storage.set("scheduleCode", scheduleCode);
        let cache_data = storage.get(scheduleCode);
        if (cache_data) {
            $("#moduleProfile").html(cache_data.subjectCode);
            let startTime = cache_data.startTime;
            let endTime = cache_data.endTime;

            $("#moduleProfileDetail").html(`( ${startTime}-${endTime} )`);
            let dailyReadingUrl = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/pwidget/SchoolUI/getDailyReading/${scheduleCode}`;
            // let trueUrl = `https://docs.google.com/gview?url=${dailyReadingUrl}&hl=bn&embedded=true`;
            let trueUrl = `${dailyReadingUrl}`;
            $("#dailyReadingPDF").attr("src", trueUrl);
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
                <li style="width: 70%;">
                    <a class="users-list-name text-left" href="#">${fullName}</a>
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
                    <div class="timeline-item">
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
        this.saveMode = false;
        this.webinarMode = false;
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