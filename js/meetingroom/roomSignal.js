class RoomSignal {
    constructor() {
        this.conCompany;
        this.conRoom;
        this.messageCallback;

        var context = this;
    }

    send(action, sendTo, data) {
        console.log(`***************SEND ${action}`, sendTo, data);
        var tmp = {};
        tmp["action"] = action;
        tmp["from"] = USERNAME;
        tmp["sendTo"] = sendTo;
        tmp["data"] = data;
        meetingRoomSignal.send(JSON.stringify(tmp));
    }

    joinRoom(conCompany, conRoom, messageCallback) {
        var context = this;
        context.conCompany = conCompany;
        context.conRoom = conRoom;

        context.messageCallback = messageCallback;
        roomSignal.startWebSocket();
    }

    startWebSocket() {
        meetingRoomSignal = new WebSocket(`ws://localhost:8888/socket/${roomSignal.conCompany}/${roomSignal.conRoom}`);
        meetingRoomSignal.onopen = function () {
            console.log("Connected to the signaling server");
            roomSignal.send("join", "all", PROFILENAME);
        };
        meetingRoomSignal.onclose = function () {
            console.log('meetingRoomSignal is closed.');
        };
        meetingRoomSignal.onmessage = roomSignal.messageCallback;
    }
}

$(function () {
    roomSignal = new RoomSignal();
});
