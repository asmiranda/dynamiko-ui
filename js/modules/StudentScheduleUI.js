class StudentScheduleUI extends AbstractUI {
    changeModule(evt) {
        console.log("Student Schedule Loaded.", evt);
    }

    btnJoinVirtualRoom(obj) {
        console.log("Called btnJoinVirtualRoom");
        var code = $(obj).attr("code");
        meetingRoom.join("Join Room", localStorage.companyCode, code);
    }

    loadedCallback(data) {
        var context = this;
        $(document).on('click', `.btnJoinVirtualRoom[module="StudentScheduleUI"]`, function () {
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
        var context = this;
        var url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/StudentScheduleUI/getStudents/${data}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function (data) {
            console.log("loadStudents", url, data);
            $(".studentImageRoster").empty();
            $(data).each(function (index, obj) {
                var PersonId = obj.getPropDefault("PersonId", "--");
                var profileUrl = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/PersonUI/${PersonId}`;
                var fullName = `${obj.getPropDefault("firstName", "--")} ${obj.getPropDefault("lastName", "--")}`;
                var birthDate = `${obj.getPropDefault("birthDate", "--")}`;
                var str = `
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
        var context = this;
        var url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/StudentScheduleUI/getAnnouncements/${data}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function (data) {
            console.log("loadAnnouncements", url, data);
            $("#announcementList").empty();
            $(data).each(function (index, obj) {
                var SchoolAnnouncementId = obj.getPropDefault("SchoolAnnouncementId", "--");
                var announcement = obj.getPropDefault("announcement", "--");
                var announcementDate = obj.getPropDefault("announcementDate", "--");
                var announcementUrl = obj.getPropDefault("announcementUrl", "--");
                var imageCss = "width: 444px; height: 350px;";
                var boxCss = "width: 500px;";
                var profileUrl = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/SchoolAnnouncementUI/${SchoolAnnouncementId}`;
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
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadActivities(data) {
        utils.showSpin();
        var url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/StudentScheduleUI/getActivities/${data}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function (data) {
            console.log("loadActivities", url, data);
            $(".ActivityList").empty();
            $(data).each(function (index, obj) {
                var SchoolScheduleTaskId = obj.getPropDefault("SchoolScheduleTaskId", "");
                var startDate = obj.getPropDefault("taskDate", "");
                var endDate = obj.getPropDefault("endDate", "");
                var taskType = obj.getPropDefault("taskType", "");
                var detail = obj.getPropDefault("detail", "");
                var str = `
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
        var context = this;
        var url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/widget/StudentScheduleUI/getHostProfile/${data}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function (data) {
            console.log("loadFacultyHost", url, data);
            var profileUrl = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/PersonUI/${data.getProp("personId")}`;
            $(".hostProfile").attr("src", profileUrl);

            var profileName = `${data.getProp("firstName")} ${data.getProp("lastName")}`;
            $(".profile-username").html(profileName);

            var subjectScheduleProfile = data.getProp("schedConfName");
            $(".subjectScheduleProfile").html(subjectScheduleProfile);

            var totalStudents = data.getProp("studentCount");
            $(".totalStudents").html(totalStudents);

            var schoolScheduleCode = data.getProp("schoolScheduleCode");
            $(`.btnJoinVirtualRoom[module="StudentScheduleUI"]`).attr("code", schoolScheduleCode);
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

$(function () {
    studentScheduleUI = new StudentScheduleUI();
});

