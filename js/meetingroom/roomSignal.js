class RoomSignal {
    constructor() {
        this.conCompany;
        this.conRoom;
        this.messageCallback;

        var context = this;
    }

    init(conCompany, conRoom, messageCallback) {
        roomSignal.conCompany = conCompany;
        roomSignal.conRoom = conRoom;
        roomSignal.messageCallback = messageCallback;
    }

    close() {
        if (meetingRoomSignal != null) {
            meetingRoomSignal.close();
        }
        meetingRoomSignal = null;
    }

    send(action, sendTo, data) {
        console.log(`***************SEND ${action}`, sendTo);
        var tmp = {};
        tmp["action"] = action;
        tmp["from"] = storage.uname;
        tmp["sendTo"] = sendTo;
        tmp["data"] = data;

        roomSignal.asyncSend(
            function () { },
            roomSignal.messageCallback,
            function () {
                console.log(`***************ACTUAL SEND ${action}`, sendTo, "Message Size == " + data.length, data);
                meetingRoomSignal.send(JSON.stringify(tmp));
                console.log(`***************MESSAGE SENT....`);
            }
        );
    }

    asyncSend(onOpen, onMessage, sendFunc) {
        if (roomSignal.conCompany && roomSignal.conRoom) {
            if (meetingRoomSignal == null || meetingRoomSignal.readyState == WebSocket.CLOSED || meetingRoomSignal.readyState == WebSocket.CLOSING) {
                meetingRoomSignal = new WebSocket(`${MAIN_SIGNAL_URL}/meetingRoom/${roomSignal.conCompany}/${roomSignal.conRoom}`);
                meetingRoomSignal.onopen = function () {
                    onOpen();
                    sendFunc();
                };
                meetingRoomSignal.onmessage = onMessage;
            }
            else if (meetingRoomSignal.readyState == WebSocket.CONNECTING) {
                meetingRoomSignal.onopen = function () {
                    onOpen();
                    sendFunc();
                };
                meetingRoomSignal.onmessage = onMessage;
            }
            else {
                sendFunc();
            }
        }
        else {
            console.log("No selected room.");
        }
    }
}
