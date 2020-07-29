class FacultyScheduleUI extends AbstractUI {
    changeModule(evt) {
        console.log("Faculty Schedule Loaded.", evt);
    }

    btnJoinVirtualRoom(obj) {
        console.log("Called btnJoinVirtualRoom");
        let code = $(obj).attr("code");
        meetingRoom.join("Join Room", localStorage.companyCode, code);
    }

    loadedCallback(data) {
        let context = this;
        $(document).on('click', `.btnJoinVirtualRoom[module="FacultyScheduleUI"]`, function () {
            context.btnJoinVirtualRoom(this);
        });

        console.log("loadedCallback not implemented.")
        personTaskUI.loadTodoList();
        this.loadFacultyHost(data);
        this.loadActivities(data);
        this.loadAnnouncements(data);
        this.loadStudents(data);
    }

    loadStudents(data) {
        utils.showSpin();
        let context = this;
        let url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/FacultyScheduleUI/getStudents/${data}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let successFunction = function (data) {
            console.log("loadStudents", url, data);
            $(".studentImageRoster").empty();
            $(data).each(function (index, obj) {
                let code = obj.getPropDefault("code", "--");
                let profileUrl = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/PersonUI/${code}`;
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
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadAnnouncements(data) {
        utils.showSpin();
        let context = this;
        let url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/FacultyScheduleUI/getAnnouncements/${data}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let successFunction = function (data) {
            console.log("loadAnnouncements", url, data);
            $("#announcementList").empty();
            $(data).each(function (index, obj) {
                let code = obj.getPropDefault("code", "--");
                let announcement = obj.getPropDefault("announcement", "--");
                let announcementDate = obj.getPropDefault("announcementDate", "--");
                let announcementUrl = obj.getPropDefault("announcementUrl", "--");
                let imageCss = "width: 444px; height: 350px;";
                let boxCss = "width: 500px;";
                let profileUrl = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/SchoolAnnouncementUI/${code}`;
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
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadActivities(data) {
        utils.showSpin();
        let url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/FacultyScheduleUI/getActivities/${data}`;
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
                    <li class="time-label">
                        <span class="bg-red">
                            ${startDate}
                        </span>
                        <div class="box-tools pull-right" data-toggle="tooltip" title="">
                            <a class="btn" style="padding: 2px;"><i class="fa fa-edit hand btnAddActivity" recordId="${SchoolScheduleTaskId}"></i></a>
                            <a class="btn" style="padding: 2px;"><i class="fa fa-trash-o hand btnDeleteActivity" recordId="${SchoolScheduleTaskId}"></i></a>
                        </div>
                    </li>
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadFacultyHost(data) {
        utils.showSpin();
        let context = this;
        let url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/FacultyScheduleUI/getHostProfile/${data}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let successFunction = function (data) {
            console.log("loadFacultyHost", url, data);
            let code = data.getProp("code");
            let profileUrl = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/PersonUI/${code}`;
            $(".hostProfile").attr("src", profileUrl);

            let profileName = `${data.getProp("firstName")} ${data.getProp("lastName")}`;
            $(".profile-username").html(profileName);

            let subjectScheduleProfile = data.getProp("schedConfName");
            $(".subjectScheduleProfile").html(subjectScheduleProfile);

            let totalStudents = data.getProp("studentCount");
            $(".totalStudents").html(totalStudents);

            let schoolScheduleCode = data.getProp("schoolScheduleCode");
            $(`.btnJoinVirtualRoom[module="FacultyScheduleUI"]`).attr("code", schoolScheduleCode);
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

$(function () {
    facultyScheduleUI = new FacultyScheduleUI();
});

