class FacultyUI extends AbstractSubUI {
    constructor() {
        super("FacultyUI");
    }

    changeModule(evt) {
        console.log("changeModule");
        facultyUI.loadTopRecords("Faculty");
        // reportUI.loadReportList("AdmissionUI");
    }

    newRecord() {
        this.clearModuleInputs(this.moduleName);
    }

    formatSearchList(index, obj, tabName) {
        var accountName = obj.getProp("lastName") + ", " + obj.getProp("firstName");
        var level = obj.getPropDefault("gradeLevel", "--");
        var accountNumber = obj.getPropDefault("invoiceNumber", "--");
        var email = obj.getPropDefault("email");
        var AdmissionId = obj.getPropDefault("Id");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${AdmissionId}" module="${this.moduleName}" tabName="${tabName}">${accountName}</a></span>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    facultyUI = new FacultyUI();
    registeredModules.push("facultyUI");
});
