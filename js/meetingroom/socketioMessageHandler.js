class SocketIOMessageHandler {
    constructor() {
        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };
        this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });
        this.peerConnection.onicecandidate = this.iceCallback;
    }

    iceCallback(event) {
        console.log(event)
        this.peerConnection.addIceCandidate(new RTCIceCandidate(event));
    }

    processNewJoiner(data) {
        console.log("processNewJoiner", data);
        let context = this;
        this.peerConnection.createOffer(function (sdp) {
            socketIOMeetingRoom.socket.emit("offer", { "email": storage.getUname(), "room": data["room"], "to_sid": data["sid"], "sdp": sdp });
            context.peerConnection.setLocalDescription(sdp);
        }, function (error) {
            console.log("processNewJoiner", error)
        });
    }

    processOffer(data) {
        console.log("processOffer", data)
        let context = this;
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(data["sdp"]));
        this.peerConnection.createAnswer(function (answer) {
            context.peerConnection.setLocalDescription(answer);
            socketIOMeetingRoom.socket.emit("answer", { "email": storage.getUname(), "room": data["room"], "to_sid": data["sid"], "sdp": answer });
        }, function (error) {
            console.log("processOffer", error)
        });
    }

    processAnswer(data) {
        console.log("processAnswer", data)
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(data["sdp"]));
    }

    processIce(data) {
        console.log("processIce", data)
        this.peerConnection.addIceCandidate(new RTCIceCandidate(data["sdp"]));
    }
}

socketIOMessageHandler = new SocketIOMessageHandler();
