class StudentScheduleUI extends AbstractUI { 
    changeModule(evt) {
        console.log("Student Schedule Loaded.", evt);
    }
}

$(function () {
    studentScheduleUI = new StudentScheduleUI();
});

