class NotificationUI extends AbstractSubUI {
    constructor() {
        super("NotificationUI");
    }

    onProfileLoaded(data) {
        console.log("On Profile Loaded called.", data);

        var recordId = data.NotificationId;
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/NotificationUI/getMessageThread/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(ret) {
            console.log("onProfileLoaded", url, ret);
            $("#messageThread").html(ret.value);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
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
                <div style="flex: 2;"><a href="#" class="${this.selectSearchRecord}" recordId="${NotificationId}" module="${this.moduleName}" tabName="${tabName}">${fromEmail}</a></div>
                <div style="flex: 2;">${emailReceiver}</div>
                <div style="flex: 1;">${receivedDate}</div>
                <div style="flex: 4;">${message}</div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        return str;
    }
}

$(function () {
    notificationUI = new NotificationUI();
});
