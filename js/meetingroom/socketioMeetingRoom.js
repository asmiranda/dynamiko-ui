class SocketIOMeetingRoom {
    constructor() {
        this.title
        this.roomCode
        this.socket = io.connect('http://localhost:5000')
    }

    openRoom() {
        let context = this;

        let successRoomPopup = function (data) {
            mediaStream.initMedia(function () {
                context.socket.on('offer', function (data) {
                    console.log("offer", data);
                });

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