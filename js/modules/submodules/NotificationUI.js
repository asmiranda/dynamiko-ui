class NotificationUI extends AbstractSubUI {
    constructor() {
        super("NotificationUI");
    }

    newRecord() {   
        this.clearModuleInputs(this.moduleName);
    }

    formatSearchList(index, obj, tabName) {
        var fromEmail = obj.getPropDefault("fromEmail", "");
        var emailReceiver = obj.getPropDefault("emailReceiver", "");
        var receivedDate = obj.getPropDefault("receivedDate", "");
        var message = obj.getPropDefault("message", "--");
        if (message.length>30) {
            message = message.subStr(0, 30);
        }
        var NotificationId = obj.getProp("NotificationId");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${NotificationId}" module="${this.moduleName}" tabName="${tabName}">${fromEmail}</a></span>
                    <span class="pull-right" style="font-size: 14px;">${receivedDate}</span><br/>
                </div>
                <div style="flex: 100%;">
                    <span><a href="#" class="${this.selectSearchRecord}" recordId="${NotificationId}" module="${this.moduleName}" tabName="${tabName}">
                        To: ${emailReceiver}</a></span>
                    <p>${message}...</p>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    notificationUI = new NotificationUI();
});
