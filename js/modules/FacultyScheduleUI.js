class FacultyScheduleUI extends AbstractUI { 
    changeModule(evt) {
        console.log("Faculty Schedule Loaded.", evt);
    }

    loadedCallback(data) {
        console.log("loadedCallback not implemented.")
        this.loadFacultyHost(data);
    }

    loadFacultyHost(data) {
        utils.showSpin();
        var context = this;
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/FacultyScheduleUI/getHostProfile/${data}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log("loadFacultyHost", url, data);
            var profileUrl = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/PersonUI/${data.getProp("personId")}`;
            $(".hostProfile").attr("src", profileUrl);

            var profileName = `${data.getProp("firstName")} ${data.getProp("lastName")}`;
            $(".profile-username").html(profileName);

            var subjectScheduleProfile = `${data.getProp("subjectCode")} [${data.getProp("days")} ${data.getProp("startTime")} - ${data.getProp("endTime")}]`;
            $(".subjectScheduleProfile").html(subjectScheduleProfile);
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

$(function () {
    facultyScheduleUI = new FacultyScheduleUI();
});

