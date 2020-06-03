class P2P {
    constructor(roomName, localUser, remoteUser, localStream, localVideo, remoteVideo) {
        console.log(roomName, localUser, remoteUser);

        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };

        var context = this;

        this.roomName = roomName;
        this.localUser = localUser;
        this.remoteUser = remoteUser;
        this.localStream = localStream;
        this.localVideo = localVideo;
        this.remoteVideo = remoteVideo;
        this.offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        };
        this.myP2P = new RTCPeerConnection(this.peerConnectionConfig);

        this.myP2P.onicecandidate = function () {
            if (event.candidate != null) {
                console.log('SENDING ICE');
                context.signalMessage('sendIce', '1', JSON.stringify({ 'ice': event.candidate }));
            }
        }
        //Wait for their video stream
        this.myP2P.onaddstream = function () {
            gotRemoteStream(event)
        }
        //Add the local video stream
        this.myP2P.addStream(localStream);
    }

    offer() {
        var context = this;
        context.myP2P.createOffer().then(function (description) {
            context.myP2P.setLocalDescription(description).then(function () {
                // console.log(connections);
                context.signalMessage('offer', '1', JSON.stringify({ 'sdp': context.myP2P.localDescription }));
            }).catch(e => console.log(e));
        });
    }

    gotRemoteStream(e) {
        if (this.remoteVideo.srcObject !== e.streams[0]) {
            this.remoteVideo.srcObject = e.streams[0];
            console.log('Remote PC received remote stream');
        }
    }

    pollMessageFromServer() {
        //todo: poll messages from server then trigger the events. Think of this as the remote machine.

        //Parse the incoming signal
        var signal = JSON.parse(message)

        //Make sure it's not coming from yourself
        if (fromId != socketId) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function () {
                    if (signal.sdp.type == 'offer') {
                        connections[fromId].createAnswer().then(function (description) {
                            connections[fromId].setLocalDescription(description).then(function () {
                                socket.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }

    signalMessage(action, peerName, data) {
        console.log("signalMessage", action, peerName, data);
    }
}