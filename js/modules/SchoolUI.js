class SchoolUI extends AbstractUI { 
    changeModule(evt) {
        admissionUI.loadTopRecords("Admission");
    }
}

$(function () {
    schoolUI = new SchoolUI();
});

