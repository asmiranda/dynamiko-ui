class ChatMessageWriter {
    sendChatToOthers(sendChatMessageTo, message) {
        console.log("Sending chat ", sendChatMessageTo, message);
        var chatMessageForSending = `chat|${message}`;

        if (sendChatMessageTo=='All') {
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

    writeToChatForMe(message) {
        var timeReceived = moment().format('h:mm');

        var str = `
            <div>
                <p class="message">
                    <a href="#" class="name" style="color: blue;">
                        <small class="text-muted pull-right"><i class="fa fa-clock-o"></i> ${timeReceived}</small>
                        Me
                    </a>
                    ${message}
                </p>
            </div>
        `;
        $("#chat-box").append(str);
    }

    writeToChatFromSender(sentFrom, data) {
        console.log("Write to chat ", data);
        var myP2P = allP2P.get(sentFrom);
        var arr = data.split("|", 2);

        var message = arr[1];
        var profile = myP2P.profile;
        var timeReceived = moment().format('h:mm');

        var str = `
            <div>
                <p class="message">
                    <a href="#" class="name changeSendTo" sendTo="${sentFrom}">
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