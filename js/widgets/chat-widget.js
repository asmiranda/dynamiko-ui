class ChatWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("ChatWidget");

        $("#btnChatMessage").click(function() {
            context.sendBot();
        });
        $("#userChatMessage").on('keyup', function (e) {
            if (e.keyCode === 13) {
                context.sendBot();
            }
        });
    }

    sendBot() {
        var context = this;

        var value = $("#userChatMessage").val();
        if (value && value.trim()!="") {
            var url = MAIN_URL+'/api/generic/widget/ChatWidget/'+value;
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                console.log(data);
                context.writeFromUser(value)
                context.writeFromBot(data);
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxGet();
        }
    }

    writeFromUser(value) {
        var str = `
        <div class="direct-chat-msg right">
            <div class="direct-chat-text">
                ${value}
            </div>
        </div>
        `;
        $(".direct-chat-messages").append(str);
        $("#userChatMessage").val("");
        $(".direct-chat-messages").stop().animate({ scrollTop: $(".direct-chat-messages")[0].scrollHeight}, 1000);
    }

    writeFromBot(value) {
        var str = `
        <div class="direct-chat-msg">
            <div class="direct-chat-text">
                ${value}
            </div>
        </div>
        `;
        $(".direct-chat-messages").append(str);
    }
}
