class SocketIOMeetingRoom {
    init() {
        this.title
        this.socket = io.connect(MAIN_URL)

        let context = this;
        this.socket.on('onjoinedroom', function (data) {
            // console.log("onjoinedroom", data);
            socketIOMessageHandler.onJoinedRoom(context.socket, data);
        });
        this.socket.on('onwelcomejoiner', function (data) {
            // console.log("onwelcomejoiner", data);
            socketIOMessageHandler.onWelcomeJoiner(context.socket, data);
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

    leaveRoom() {
        socketIOMessageHandler.leaveRoom(this.socket);
    }

    join(title, roomCode) {
        let context = this;
        this.title = `${title} [${roomCode}]`;
        storage.setRoomCode(roomCode)
        socketIOMessageHandler.joinRoom(context.socket);
    }
}

$(function () {
    socketIOMeetingRoom = new SocketIOMeetingRoom();
    socketIOMessageHandler = new SocketIOMessageHandler();
    socketIOP2P = new SocketIOP2P();
    socketIOMediaStream = new SocketIOMediaStream();
    screenShare = new ScreenShare();
    console.log("screenShare", screenShare);
})