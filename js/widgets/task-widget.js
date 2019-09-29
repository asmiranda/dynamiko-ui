class TaskWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("Testing Task Widget");

        this.loadTask();
    }

    loadTask() {
        var context = this;
        var url = MAIN_URL+'/api/generic/widget/TasksWidget/all';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            context.clearInbox();
            $(data).each(function(index, obj) {
                console.log(obj);
                var wfMessageId = obj.getProp("WfMessageId");
                var fromAssignee = obj.getProp("fromAssignee");
                var description = obj.getProp("description");
                var dateSent = new Date(obj.getProp("dateSent"));
                var dateStr = moment(dateSent).format('DD MMM HH:mm a');
                var actionStr = obj.getProp("actionStr");

                var str = `
                    <div class="direct-chat-msg">
                        <div class="direct-chat-info clearfix">
                            <span class="direct-chat-name pull-left">${fromAssignee}</span>
                            <span class="direct-chat-timestamp pull-right">${dateStr}</span>
                        </div>
                        <img class="direct-chat-img" src="../dist/img/user1-128x128.jpg" alt="User">
                        <div class="direct-chat-text">${description}</div>
                    </div>
                `;
                // console.log(str);
                if (actionStr.includes('approv')) {
                    $(".forApprovalMessage").append(str);
                }
                else {
                    $(".forEndorsementMessage").append(str);
                }
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    clearInbox() {
        $(".forEndorsementMessage").empty();
        $(".forEndorsementMessage").empty();
    }
}
