class SocketIOMessageHandler {
    joinRoom(mySocket, room) {
        console.log(`joinRoom ${room}`)
        mySocket.emit("joinroom", { "fromEmail": storage.getUname(), "room": room });
    }

    leaveRoom(mySocket, room) {
        console.log(`leaveRoom ${room}`)
        mySocket.emit("leaveroom", { "fromEmail": storage.getUname(), "room": room });
    }

    onJoinedRoom(mySocket, data) {
        socketIOP2P.sendOffer(mySocket, data);
    }

    onLeaveRoom(mySocket, room) {
        console.log("onLeaveRoom", room)
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
