class MobileSocketIOMeetingRoom {
    constructor() {
        this.title
        this.socket = io.connect(MAIN_SIGNAL_URL)

        let context = this;
        this.socket.on('onjoinedroom', function (data) {
            // console.log("onjoinedroom", data);
            mobileSocketIOMessageHandler.onJoinedRoom(context.socket, data);
        });
        this.socket.on('onwelcomejoiner', function (data) {
            // console.log("onwelcomejoiner", data);
            mobileSocketIOMessageHandler.onWelcomeJoiner(context.socket, data);
        });
        this.socket.on('offer', function (data) {
            // console.log("offer", data);
            mobileSocketIOMessageHandler.onOffer(context.socket, data);
        });
        this.socket.on('answer', function (data) {
            // console.log("answer", data);
            mobileSocketIOMessageHandler.onAnswer(context.socket, data);
        });
        this.socket.on('ice', function (data) {
            // console.log("ice", data);
            mobileSocketIOMessageHandler.onIce(context.socket, data);
        });
        this.socket.on('onleaveroom', function (data) {
            // console.log("onleaveroom", data);
            mobileSocketIOMessageHandler.onLeaveRoom(context.socket, data);
        });

        $(document).on('click', '.miniVideoStream', function () {
            context.displayToMainScreen(this);
        });
    }

    displayToMainScreen(obj) {
        var videoElem = document.querySelectorAll(`#activeVideo`)[0];
        videoElem.srcObject = obj.srcObject;
    }

    openRoom() {
        let context = this;

        mobileSocketIOMediaStream.initVideo(function () {
            console.log("Local Media Started");
            mobileSocketIOMessageHandler.joinRoom(context.socket);
        });
    }

    leaveRoom() {
        mobileSocketIOMessageHandler.leaveRoom(this.socket);
    }

    join(title, roomCode) {
        let context = this;
        this.title = `${title} [${roomCode}]`;
        mobileSocketIOMessageHandler.leaveRoom(context.socket)
        mobileStorage.roomCode = roomCode;

        this.openRoom();
    }
}

$(function () {
    mobileSocketIOMeetingRoom = new MobileSocketIOMeetingRoom();
    mobileSocketIOMessageHandler = new MobileSocketIOMessageHandler();
    mobileSocketIOP2P = new MobileSocketIOP2P();
    mobileSocketIOMediaStream = new MobileSocketIOMediaStream();
    window.onbeforeunload = mobileSocketIOMeetingRoom.leaveRoom();
})