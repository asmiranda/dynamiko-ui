class SchoolUI extends AbstractUI {
    changeModule(evt) {
        admissionUI.loadTopRecords("Admission");
    }

    loadAnnouncements() {
        $("#announcementContent").attr("src", ANNOUNCEMENT_URL);
    }

}

$(function () {
    schoolUI = new SchoolUI();
    registeredModules.push("schoolUI");
});

