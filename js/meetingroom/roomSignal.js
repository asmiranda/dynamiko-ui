class RoomSignal {
    constructor() {
        this.conCompany;
        this.conRoom;
        this.sockjs;
        this.messageCallback;

        var context = this;
    }

    send(action, sendTo, data) {
        console.log(`send signal ${action}`);
        var tmp = {};
        tmp["action"] = action;
        tmp["from"] = USERNAME;
        tmp["sendTo"] = sendTo;
        tmp["data"] = data;
        this.sockjs.send(JSON.stringify(tmp));
    }

    joinRoom(conCompany, conRoom, messageCallback) {
        var context = this;
        context.conCompany = conCompany;
        context.conRoom = conRoom;

        context.messageCallback = messageCallback;
        context.sockjs = new SockJS(`${MAIN_URL}/socket/${context.conCompany}/${context.conRoom}`);
        context.sockjs.onopen = function () {
            console.log("Connected to the signaling server");
            context.send("join", "all", PROFILENAME);
        };
        context.sockjs.onclose = function () {
            console.log('close');
        };
        context.sockjs.onmessage = context.messageCallback;
    }
}

$(function () {
    roomSignal = new RoomSignal();
});
