class MobileSocketIOMessageHandler {
    joinRoom(mySocket) {
        console.log(`joinRoom ${mobileStorage.roomCode}`)

        mySocket.emit("joinroom", { "fromEmail": mobileStorage.uname, "room": mobileStorage.roomCode });
    }

    onJoinedRoom(mySocket, data) {
        mobileSocketIOP2P.initJoinedRoom(mySocket, data);
    }

    onWelcomeJoiner(mySocket, data) {
        mobileSocketIOP2P.initWelcomeJoiner(mySocket, data);
    }

    onOffer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        if (mobileStorage.uname != fromEmail) {
            mobileSocketIOP2P.onOffer(mySocket, data);
        }
    }

    onAnswer(mySocket, data) {
        let fromEmail = data["fromEmail"];
        if (fromEmail != mobileStorage.uname) {
            mobileSocketIOP2P.onAnswer(mySocket, data);
        }
    }

    onIce(mySocket, data) {
        mobileSocketIOP2P.onIce(mySocket, data);
    }

    leaveRoom(mySocket) {
        console.log(`leaveRoom`)
        if (mobileStorage.roomCode) {
            mySocket.emit("leaveroom", { "fromEmail": mobileStorage.uname, "room": mobileStorage.roomCode });
        }
    }

    onLeaveRoom(mySocket, data) {
        console.log("onLeaveRoom", data)
        mobileSocketIOP2P.onLeaveRoom(mySocket, data);
    }
}
