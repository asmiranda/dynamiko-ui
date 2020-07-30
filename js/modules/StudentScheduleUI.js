class StudentScheduleUI extends AbstractUI {
    changeModule(evt) {
        console.log("Faculty Schedule Loaded.", evt);
    }

    btnJoinVirtualRoom(obj) {
        console.log("Called btnJoinVirtualRoom");
        let scheduleCode = $(obj).attr("code");
        // meetingRoom.join("Join Room", storage.getCompanyCode(), code);
        socketIOMeetingRoom.join("Join Room", scheduleCode);
    }

    loadedCallback(scheduleCode) {
        let context = this;
        $(document).on('click', `.btnJoinVirtualRoom[module="StudentScheduleUI"]`, function () {
            context.btnJoinVirtualRoom(this);
        });

        console.log("loadedCallback not implemented.")
        personTaskUI.loadTodoList();
        schoolUI.loadFacultyHost(scheduleCode);
        schoolUI.loadActivities(scheduleCode);
        schoolUI.loadAnnouncements(scheduleCode);
        schoolUI.loadStudents(scheduleCode);
    }

}

$(function () {
    studentScheduleUI = new StudentScheduleUI();
});

