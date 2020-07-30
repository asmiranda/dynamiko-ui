class SocketIOMeetingRoom {
    constructor() {
        this.title
        this.roomCode
        this.socket
    }

    openRoom() {
        let context = this;

        let successRoomPopup = function (data) {
            mediaStream.initMedia(function () {
                this.socket.on('joined', function (data) {
                    console.log("joined", data);
                });

                this.socket.emit("join", { data: 'Joining!' });
                this.socket.emit("message", { data: 'Sending Message!' });
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
        this.socket = io.connect('http://localhost:5000')

        let context = this;

        this.socket.on('connect', function () {
            context.openRoom();
        });
    }
}

$(function () {
    socketIOMeetingRoom = new SocketIOMeetingRoom();
})