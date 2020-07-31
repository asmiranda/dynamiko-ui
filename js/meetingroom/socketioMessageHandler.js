class SocketIOMessageHandler {
    joinRoom(mySocket, room) {
        console.log(`joinRoom ${room}`)
        this.leaveRoom(mySocket)

        storage.setRoomCode(room)
        mySocket.emit("joinroom", { "fromEmail": storage.getUname(), "room": storage.getRoomCode() });
    }

    leaveRoom(mySocket) {
        console.log(`leaveRoom`)
        if (storage.getRoomCode()) {
            mySocket.emit("leaveroom", { "fromEmail": storage.getUname(), "room": storage.getRoomCode() });
        }
    }

    onJoinedRoom(mySocket, data) {
        socketIOP2P.sendOffer(mySocket, data);
    }

    onLeaveRoom(mySocket, data) {
        console.log("onLeaveRoom", data)
        socketIOP2P.onLeaveRoom(mySocket, data);
    }

    onOffer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        if (storage.getUname() != fromEmail) {
            socketIOP2P.onOffer(mySocket, data);
        }
    }

    onAnswer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        if (fromEmail != storage.getUname()) {
            socketIOP2P.onAnswer(mySocket, data);
        }
    }

    onIce(mySocket, data) {
        socketIOP2P.onIce(mySocket, data);
    }
}
