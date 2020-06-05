class RoomSignal {
    constructor() {
        this.conCompany;
        this.conRoom;
        this.sockjs;
        this.messageCallback;

        var context = this;
    }

    send(action, data) {
        console.log(`send signal ${action}`);
        var tmp = {};
        tmp["action"] = action;
        tmp["from"] = USERNAME;
        tmp["data"] = data;
        this.sockjs.send(JSON.stringify(tmp));
    }

    initConnectionListeners() {
        context.sockjs.onopen = function () {
            console.log("Connected to the signaling server");
        };
        context.sockjs.onclose = function () {
            console.log('close');
        };
        // context.sockjs.onmessage = context.messageCallback;

        context.sockjs.onmessage = function (msg) {
            console.log("Got message", msg.data, msg);
            // var content = JSON.parse(msg.data);
            // var data = content.data;
            // switch (content.event) {
            //     // when somebody wants to call us
            //     case "offer":
            //         context.handleOffer(data);
            //         break;
            //     case "answer":
            //         context.handleAnswer(data);
            //         break;
            //     // when a remote peer sends an ice candidate to us
            //     case "candidate":
            //         context.handleCandidate(data);
            //         break;
            //     default:
            //         break;
            // }
        };
    }

    joinRoom(conCompany, conRoom, messageCallback) {
        var context = this;
        context.conCompany = conCompany;
        context.conRoom = conRoom;

        context.messageCallback = messageCallback;
        context.sockjs = new SockJS(`${MAIN_URL}/socket/${context.conCompany}/${context.conRoom}`);
        context.sockjs.onopen = function () {
            console.log("Connected to the signaling server");
            context.send("join", PROFILENAME);
        };
        context.sockjs.onclose = function () {
            console.log('close');
        };
        context.sockjs.onmessage = context.messageCallback;
        // context.sockjs.onmessage = function (msg) {
        //     console.log("Got message", msg.data, msg);
        // };
    }
}

$(function () {
    roomSignal = new RoomSignal();
});
