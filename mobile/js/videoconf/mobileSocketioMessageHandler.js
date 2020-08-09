class MobileSocketIOMessageHandler {
    joinRoom(mySocket) {
        console.log(`joinRoom ${storage.getRoomCode()}`)

        mySocket.emit("joinroom", { "fromEmail": storage.getUname(), "room": storage.getRoomCode() });
    }

    onJoinedRoom(mySocket, data) {
        mobileSocketIOP2P.initJoinedRoom(mySocket, data);
    }

    onWelcomeJoiner(mySocket, data) {
        mobileSocketIOP2P.initWelcomeJoiner(mySocket, data);
    }

    onOffer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        if (storage.getUname() != fromEmail) {
            mobileSocketIOP2P.onOffer(mySocket, data);
        }
    }

    onAnswer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        if (fromEmail != storage.getUname()) {
            mobileSocketIOP2P.onAnswer(mySocket, data);
        }
    }

    onIce(mySocket, data) {
        mobileSocketIOP2P.onIce(mySocket, data);
    }

    leaveRoom(mySocket) {
        console.log(`leaveRoom`)
        if (storage.getRoomCode()) {
            mySocket.emit("leaveroom", { "fromEmail": storage.getUname(), "room": storage.getRoomCode() });
        }
    }

    onLeaveRoom(mySocket, data) {
        console.log("onLeaveRoom", data)
        mobileSocketIOP2P.onLeaveRoom(mySocket, data);
    }
}
