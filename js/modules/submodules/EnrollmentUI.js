class EnrollmentUI extends AbstractSubUI {
    constructor() {
        super("EnrollmentUI");
        this.EnrollmentScheduleUI = "EnrollmentScheduleUI";
    }

    arrangeRecordProfileAllSubRecords(data, clsName) {
        this.formatSubRecordsFromMain(this.EnrollmentScheduleUI, data, clsName);
    }

    changeModule(evt) {
        console.log("changeModule");
        enrollmentUI.loadTopRecords("Enrollment");
        // reportUI.loadReportList("EnrollmentUI");
    }

    newRecord() {
        this.clearModuleInputs(this.moduleName);
        this.clearModuleInputs(this.EnrollmentScheduleUI);
    }

    formatSearchList(index, obj, tabName) {
        var accountName = obj.getProp("lastName") + ", " + obj.getProp("firstName");
        var EnrollmentId = obj.getPropDefault("id");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${EnrollmentId}" module="${this.moduleName}" tabName="${tabName}">${accountName}</a></span>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    enrollmentUI = new EnrollmentUI();
    registeredModules.push("enrollmentUI");
});
