class ChatMessageWriter {
    sendChatToOthers(sendChatMessageTo, message) {
        var chatMessageForSending = `chat|${sendChatMessageTo}|${message}`;

        if (sendChatMessageTo=='') {
            allP2P.forEach(function (value, key) {
                var myP2P = value;
                myP2P.dataChannel.send(chatMessageForSending);
            });
        }
        else {
            var myP2P = allP2P.get(sendChatMessageTo);
            myP2P.dataChannel.send(chatMessageForSending);
        }
    }

    writeToChat(data) {
        var arr = data.split("|", 3);
        var sendChatMessageTo = arr[1];
        var message = arr[2];

        var profile = "All";
        if (sendChatMessageTo!='') {
            var myP2P = allP2P.get(sendChatMessageTo);
            profile = myP2P.profile;
        }
        var timeReceived = moment().format('h:mm');

        var str = `
            <div>
                <p class="message">
                    <a href="#" class="name changeSendTo" sendTo="${sendChatMessageTo}">
                        <small class="text-muted pull-right"><i class="fa fa-clock-o"></i> ${timeReceived}</small>
                        ${profile}
                    </a>
                    ${message}
                </p>
            </div>
        `;
        $("#chat-box").append(str);
    }
}