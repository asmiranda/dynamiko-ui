class RoomSignal {
    constructor() {
        this.conCompany;
        this.conRoom;
        this.messageCallback;

        var context = this;
    }

    close() {
        if (meetingRoomSignal!=null) {
            meetingRoomSignal.close();
        }
        meetingRoomSignal = null;
    }

    send(action, sendTo, data) {
        console.log(`***************SEND ${action}`, sendTo, data);
        var tmp = {};
        tmp["action"] = action;
        tmp["from"] = USERNAME;
        tmp["sendTo"] = sendTo;
        tmp["data"] = data;

        roomSignal.asyncSend(
            function() {}, 
            roomSignal.messageCallback,
            function() {
                meetingRoomSignal.send(JSON.stringify(tmp));
            }
        );
    }

    joinRoom(conCompany, conRoom, messageCallback) {
        roomSignal.conCompany = conCompany;
        roomSignal.conRoom = conRoom;
        roomSignal.messageCallback = messageCallback;

        roomSignal.asyncSend(
            function() {
                roomSignal.send("req-join", "all", PROFILENAME);
            }, 
            roomSignal.messageCallback, 
            function() {}
        );
    }

    asyncSend(onOpen, onMessage, sendFunc) {
        if (roomSignal.conCompany && roomSignal.conRoom) {
            if (meetingRoomSignal==null || meetingRoomSignal.readyState==WebSocket.CLOSED || meetingRoomSignal.readyState==WebSocket.CLOSING) {
                meetingRoomSignal = new WebSocket(`ws://localhost:8888/meetingRoom/${roomSignal.conCompany}/${roomSignal.conRoom}`);
                meetingRoomSignal.onopen = function() {
                    onOpen();
                    sendFunc();
                };
                meetingRoomSignal.onmessage = onMessage;
            }
            else if (meetingRoomSignal.readyState==WebSocket.CONNECTING) {
                meetingRoomSignal.onopen = function() {
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
