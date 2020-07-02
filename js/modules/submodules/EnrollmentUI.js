class EnrollmentUI extends AbstractSubUI {
    constructor() {
        super("EnrollmentUI");
    }

    changeModule(evt) {
        console.log("changeModule");
        enrollmentUI.loadTopRecords("Enrollment");
        reportUI.loadReportList("EnrollmentUI");
    }

    newRecord() {   
        this.clearModuleInputs(this.moduleName);
    }

    formatSearchList(index, obj, tabName) {
        var accountName = obj.getProp("lastName") + ", " + obj.getProp("firstName");
        var level = obj.getPropDefault("gradeLevel", "--");
        var accountNumber = obj.getPropDefault("invoiceNumber", "--");
        var email = obj.getPropDefault("email");
        var EnrollmentId = obj.getPropDefault("EnrollmentId");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${EnrollmentId}" module="${this.moduleName}" tabName="${tabName}">${accountName}</a></span>
                    <span class="pull-right">Level: ${level}</span><br/>
                </div>
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${EnrollmentId}" module="${this.moduleName}" tabName="${tabName}">
                        Invoice #: ${accountNumber}</a></span>
                    <span class="pull-right" style="font-size: 14px;">${email}</span><br/>
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
