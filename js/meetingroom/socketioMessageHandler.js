class SocketIOMessageHandler {
    joinRoom(mySocket, room) {
        console.log("joinRoom", room)
        mySocket.emit("joinroom", { "fromEmail": storage.getUname(), "room": room });
    }

    leaveRoom(mySocket, room) {
        console.log("leaveRoom", room)
        mySocket.emit("leaveroom", { "fromEmail": storage.getUname(), "room": room });
    }

    onJoinedRoom(mySocket, data) {
        console.log("onJoinedRoom", data)
        this.sendOffer(mySocket, data);
    }

    onLeaveRoom(mySocket, room) {
        console.log("onLeaveRoom", room)
    }

    sendOffer(mySocket, data) {
        console.log("sendOffer")
        socketIOP2P.sendOffer(mySocket, data);
    }

    receiveOffer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        if (storage.getUname() != fromEmail) {
            console.log("receiveOffer processing....")
            socketIOP2P.sendAnswer(mySocket, data);
        }
    }

    receiveAnswer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        console.log("receiveAnswer", fromEmail, storage.getUname())
        if (fromEmail != storage.getUname()) {
            socketIOP2P.startSharing(mySocket, data);
        }
    }

    receiveIce(mySocket, data) {
        console.log("receiveIce", data)
        socketIOP2P.receiveIce(mySocket, data);
    }
}
