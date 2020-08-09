class SocketIOP2P {
    constructor() {
        this.peerConnections = [];
        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };
    }

    isMessageForMe(data) {
        let toEmail = data["toEmail"];
        return toEmail == storage.getUname();
    }

    initJoinedRoom(mySocket, data) {
        let toEmail = data["fromEmail"];
        let myP2P = new MyP2P(toEmail, false);
        this.peerConnections[toEmail] = myP2P;
        myP2P.initVideoBox();
        mySocket.emit("welcomejoiner", { "fromEmail": storage.getUname(), "toEmail": toEmail, "room": storage.getRoomCode() });
    }

    initWelcomeJoiner(mySocket, data) {
        if (this.isMessageForMe(data)) {
            let toEmail = data["fromEmail"];
            let myP2P = new MyP2P(toEmail, true);
            this.peerConnections[toEmail] = myP2P;
            myP2P.initVideoBox();
            myP2P.initPeerConnection();
        }
    }

    onOffer(mySocket, data) {
        if (this.isMessageForMe(data)) {
            let toEmail = data["fromEmail"];
            let myP2P = this.peerConnections[toEmail]
            myP2P.initPeerConnection();

            this.peerConnections[toEmail] = myP2P;

            let pAnswer = null;
            myP2P.peerConnection.setRemoteDescription(new RTCSessionDescription(data["sdp"]));
            myP2P.peerConnection.createAnswer().then(function (answer) {
                pAnswer = answer;
                return myP2P.peerConnection.setLocalDescription(answer);
            })
                .then(function () {
                    console.log(`onOffer to ${toEmail}`)
                    mySocket.emit("answer", { "fromEmail": storage.getUname(), "toEmail": toEmail, "sdp": pAnswer, "room": storage.getRoomCode() });
                })
                .catch(e => console.log(e));
        }
    }

    onAnswer(mySocket, data) {
        if (this.isMessageForMe(data)) {
            let toEmail = data["fromEmail"];
            let myP2P = this.peerConnections[toEmail]
            console.log(`onAnswer with ${toEmail}`)
            myP2P.peerConnection.setRemoteDescription(new RTCSessionDescription(data["sdp"]));
        }
    }

    onIce(mySocket, data) {
        if (this.isMessageForMe(data)) {
            let toEmail = data["fromEmail"];
            let myP2P = this.peerConnections[toEmail]
            console.log(`onIce from ${toEmail}`, data)

            myP2P.peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
        }
    }

    onLeaveRoom(mySocket, data) {
        let toEmail = data["fromEmail"];
        let myP2P = this.peerConnections[toEmail]
        if (myP2P) {
            myP2P.leaveRoom()
        }
    }
}

class MyP2P {
    constructor(email, isOfferSender) {
        this.email = email;
        this.isOfferSender = isOfferSender;
        this.peerConnection = new RTCPeerConnection(socketIOP2P.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });
    }

    initVideoBox() {
        var context = this;
        if (!$(`.miniVideo[email="${context.email}"]`).length) {
            console.log(`initVideoBox called for ${context.email}`)
            let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/PersonUI/getProfileFromEmail/${context.email}`;
            let ajaxRequestDTO = new AjaxRequestDTO(url, "");

            let successFunction = function (data) {
                let profile = data.getProp("firstName");
                let str = `
                    <div style="flex: 1; width: 100px; display: flex; flex-direction: column; margin-bottom: 10px;" class="miniVideo" email="${context.email}">
                        <video class="miniVideoStream" id="v_${context.email}" email="${context.email}" style="width: 100px; max-height: 100px; background-color: cornflowerblue;" autoplay playsinline></video>
                        <div class="text-center" style="width: 100px; color:white;">${profile}</div>
                    </div>
                `;
                $(".videoBoxList").append(str);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    initPeerConnection() {
        let context = this;

        for (const track of socketIOMediaStream.localVideo.getTracks()) {
            this.peerConnection.addTrack(track, socketIOMediaStream.localVideo);
        }

        this.peerConnection.onnegotiationneeded = function () {
            context.onNegotiationNeeded(context.email);
        }

        this.peerConnection.onicecandidate = function (event) {
            context.sendIce(event);
        }

        this.peerConnection.ontrack = function (ev) {
            context.onTrack(ev);
        };
    }

    onNegotiationNeeded(toEmail) {
        if (this.isOfferSender) {
            let context = this;
            this.peerConnection.createOffer(function (sdp) {
                console.log(`sendOffer to ${toEmail}`)
                context.peerConnection.setLocalDescription(sdp);
                socketIOMeetingRoom.socket.emit("offer", { "fromEmail": storage.getUname(), "toEmail": context.email, "sdp": sdp, "room": storage.getRoomCode() });
            }, function (error) {
                console.log("sendOffer", error)
            });
        }
    }

    onTrack(ev) {
        let context = this;
        if (ev.streams && ev.streams[0]) {
            context.onReceiveVideo(ev.streams[0]);
        }
    };

    onReceiveVideo(tmpMedia) {
        console.log(`onReceiveVideo track from ${this.email}`, tmpMedia)
        let videoElem = document.getElementById(`v_${this.email}`);
        console.log(videoElem)
        videoElem.srcObject = tmpMedia;
    }

    onReceiveScreen(tmpMedia) {
        console.log(`onReceiveScreen track from ${this.email}`)
        var videoElem = document.querySelector(`#activeVideo`)[0];
        console.log(videoElem);
        videoElem.srcObject = tmpMedia;
    }

    leaveRoom() {
        // $(`.miniVideo[email="${this.email}"]`).remove();
    }

    sendIce(event) {
        if (event.candidate) {
            socketIOMeetingRoom.socket.emit("ice", { "fromEmail": storage.getUname(), "toEmail": this.email, "ice": event.candidate, "room": storage.getRoomCode() });
        }
    }
}
