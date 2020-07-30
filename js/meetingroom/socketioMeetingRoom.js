class SocketIOMeetingRoom {
    constructor() {
        this.title
        this.roomCode
        this.socket = io.connect('http://localhost:5000')

        this.socket.on('new_join', function (data) {
            console.log("new_join", data);
            socketIOMessageHandler.processNewJoiner(data);
        });
        this.socket.on('offer', function (data) {
            console.log("offer", data);
            socketIOMessageHandler.processOffer(data);
        });
        this.socket.on('answer', function (data) {
            console.log("answer", data);
            socketIOMessageHandler.processAnswer(data);
        });
        this.socket.on('ice', function (data) {
            console.log("ice", data);
            socketIOMessageHandler.processIce(data);
        });
    }

    openRoom() {
        let context = this;

        let successRoomPopup = function (data) {
            mediaStream.initMedia(function () {
                context.socket.emit("join", { "email": storage.getUname(), "room": context.roomCode });
            });
        }
        let successCallback = function (data) {
            showModalAny1200NoButtons.show(context.title, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "SocketIOMeetingRoom", successCallback);
    }

    join(title, roomCode) {
        this.title = `${title} [${roomCode}]`;
        this.roomCode = roomCode;

        this.openRoom();
    }
}

$(function () {
    socketIOMeetingRoom = new SocketIOMeetingRoom();
})