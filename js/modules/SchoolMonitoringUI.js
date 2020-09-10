class SchoolMonitoringUI extends AbstractUI {
    loadUI() {
        alert("Do not load UI");
    }
}

$(function () {
    schoolMonitoringUI = new SchoolMonitoringUI();
    registeredModules.push("schoolMonitoringUI");
});
