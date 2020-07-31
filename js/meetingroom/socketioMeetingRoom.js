class SocketIOMeetingRoom {
    constructor() {
        this.title
        this.socket = io.connect('http://localhost:5000')

        let context = this;
        this.socket.on('onjoinedroom', function (data) {
            // console.log("onjoinedroom", data);
            socketIOMessageHandler.onJoinedRoom(context.socket, data);
        });
        this.socket.on('offer', function (data) {
            // console.log("offer", data);
            socketIOMessageHandler.onOffer(context.socket, data);
        });
        this.socket.on('answer', function (data) {
            // console.log("answer", data);
            socketIOMessageHandler.onAnswer(context.socket, data);
        });
        this.socket.on('ice', function (data) {
            // console.log("ice", data);
            socketIOMessageHandler.onIce(context.socket, data);
        });
        this.socket.on('onleaveroom', function (data) {
            // console.log("onleaveroom", data);
            socketIOMessageHandler.onLeaveRoom(context.socket, data);
        });
    }

    openRoom() {
        let context = this;

        let successRoomPopup = function (data) {
            mediaStream.initMedia(function () {
                console.log("Local Media Started");
            });
        }
        let successCallback = function (data) {
            showModalAny1200NoButtons.show(context.title, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "SocketIOMeetingRoom", successCallback);
    }

    leaveRoom() {
        socketIOMessageHandler.leaveRoom(this.socket, storage.getRoomCode());
    }

    join(title, roomCode) {
        let context = this;
        this.title = `${title} [${roomCode}]`;
        if (storage.getRoomCode() && roomCode != storage.getRoomCode()) {
            socketIOMessageHandler.leaveRoom(context.socket, storage.getRoomCode());
        }
        storage.setRoomCode(roomCode);
        socketIOMessageHandler.joinRoom(context.socket, storage.getRoomCode());

        this.openRoom();
    }
}

$(function () {
    socketIOMeetingRoom = new SocketIOMeetingRoom();
    socketIOMessageHandler = new SocketIOMessageHandler();
    socketIOP2P = new SocketIOP2P();
    socketIOMediaStream = new SocketIOMediaStream();
    window.onbeforeunload = socketIOMeetingRoom.leaveRoom();
})