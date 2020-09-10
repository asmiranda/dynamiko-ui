class SchoolScheduleUI extends AbstractSubUI {
    constructor() {
        super("SchoolScheduleUI");
    }

    changeModule(evt) {
        console.log("changeModule");
        schoolScheduleUI.loadTopRecords("SchoolSchedule");
        // reportUI.loadReportList("SchoolScheduleUI");
    }

    newRecord() {
        this.clearModuleInputs(this.moduleName);
    }

    formatSearchList(index, obj, tabName) {
        let facultyEmail = obj.getProp("facultyEmail");
        let subjectCode = obj.getPropDefault("subjectCode", "--");
        let startTime = obj.getPropDefault("startTime", "--");
        let endTime = obj.getPropDefault("endTime");
        let id = obj.getPropDefault("Id");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${id}" module="${this.moduleName}" tabName="${tabName}">${facultyEmail}</a></span>
                    <span class="pull-right"></span><br/>
                </div>
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${id}" module="${this.moduleName}" tabName="${tabName}">
                        ${startTime} to ${endTime}</a></span>
                    <span class="pull-right" style="font-size: 14px;">${subjectCode}</span><br/>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    schoolScheduleUI = new SchoolScheduleUI();
    registeredModules.push("schoolScheduleUI");
});
