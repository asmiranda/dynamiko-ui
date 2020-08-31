class SocketIOP2P {
    constructor() {
        this.peerConnectionConfig = {
            'iceServers': [
                {
                    urls: ['stun:dynamikosoft.com:3478', 'turn:dynamikosoft.com:3478'],
                    credential: 'Miran!11',
                    username: 'dynamiko'
                },
            ]
        }
        // this.peerConnectionConfig = {
        //     'iceServers': [
        //         { 'urls': ['stun:stun.services.mozilla.com', 'stun:stun.l.google.com:19302'] },
        //     ]
        // }
    }

    sendChatMessage(chatUser, chatMessage) {
        let context = this;
        let connArr = Object.keys(this.peerConnections);
        if (chatUser == "all") {
            $(connArr).each(function (index, key) {
                let myP2P = context.peerConnections[key];
                console.log(myP2P);
                myP2P.sendChatMessage(chatMessage);
            })
        }
        else {
            let myP2P = context.peerConnections[chatUser];
            console.log(myP2P);
            myP2P.sendChatMessage(chatMessage);
        }
    }

    clearConnections() {
        $(".videoBoxList").empty();
        this.peerConnections = [];
    }

    isMessageForMe(data) {
        let fromEmail = data["fromEmail"];
        let toEmail = data["toEmail"];
        let forMe = toEmail == storage.getUname();
        forMe = forMe && fromEmail != storage.getUname();
        console.log(`is forMe[${storage.getUname()}] == ${forMe} from ${fromEmail}`);
        return forMe;
    }

    initJoinedRoom(mySocket, data) {
        console.log(`initJoinedRoom`, data)
        let fromEmail = data["fromEmail"];
        if (fromEmail != storage.getUname()) {
            let toEmail = data["fromEmail"];
            let myP2P = new MyP2P(toEmail, false);
            console.log(`initJoinedRoom New P2P for ${toEmail} - ${storage.getUname()}`);
            this.peerConnections[toEmail] = myP2P;
            mySocket.emit("welcomejoiner", { "fromEmail": storage.getUname(), "toEmail": toEmail, "room": storage.getRoomCode() });
        }
    }

    initWelcomeJoiner(mySocket, data) {
        if (this.isMessageForMe(data)) {
            let toEmail = data["fromEmail"];
            let myP2P = new MyP2P(toEmail, true);
            console.log(`initWelcomeJoiner New P2P for ${toEmail} - ${storage.getUname()}`);
            this.peerConnections[toEmail] = myP2P;
            myP2P.sendOffer();
        }
    }

    onOffer(mySocket, data) {
        if (this.isMessageForMe(data)) {
            let toEmail = data["fromEmail"];
            let myP2P = this.peerConnections[toEmail]
            this.peerConnections[toEmail] = myP2P;
            myP2P.sendAnswer(data);
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
            // console.log(`onIce from ${toEmail}`, data)

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
        let context = this;
        this.email = email;
        this.isOfferSender = isOfferSender;
        this.videoElem;
        this.sendChannel;
        this.receiveChannel;

        this.initVideoBox();
        this.peerConnection = new RTCPeerConnection(socketIOP2P.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });
        this.initDataChannel();

        this.peerConnection.onicecandidate = function (event) {
            context.sendIce(event);
        }

        this.peerConnection.ontrack = function (ev) {
            context.onTrack(ev);
        };
    }

    sendChatMessage(chatMessage) {
        let profileName = storage.getProfileName();
        let tmp = { 'dataType': 'Chat', 'profileName': profileName, 'message': chatMessage };
        this.sendChannel.send(JSON.stringify(tmp));
    }

    initVideoBox() {
        let context = this;
        console.log(`initVideoBox called for ${context.email}`)
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/PersonUI/getProfileFromEmail/${context.email}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");

        let stored_profile = storage.get(`profile_${context.email}`);
        let tmp = $(`.remoteMiniVideo[email='${context.email}']`);
        if (tmp.length == 0) {
            let str = `
                <div style="width: 70px; height: 70px; display: flex; flex-direction: column; margin-bottom: 10px;" class="remoteMiniVideo" email="${context.email}">
                    <video class="remoteMiniVideoStream" id="v_${context.email}" email="${context.email}" style="width: 100px; max-height: 100px; background-color: cornflowerblue;" autoplay playsinline></video>
                    <div class="text-center profile" style="width: 100px; color:#4d5154; margin-top:-25px;" email="${context.email}">${stored_profile}</div>
                </div>
            `;
            $(".videoBoxList").append(str);
        }
        context.videoElem = document.getElementById(`v_${context.email}`);
        if (!stored_profile) {
            let successFunction = function (data) {
                let profile = data.getProp("firstName");
                storage.set(`vprofile_${context.email}`, profile);
                $(`.profile[email='${context.email}']`).html(profile);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    sendTracks() {
        for (const track of socketIOMediaStream.localVideo.getTracks()) {
            console.log(`sendTracks to ${this.email}`)
            this.peerConnection.addTrack(track, socketIOMediaStream.localVideo);
        }
    }

    initDataChannel() {
        let context = this;
        this.sendChannel = this.peerConnection.createDataChannel("sendChannel");
        this.sendChannel.onopen = function (event) {
            console.log("sendChannel onopen", event);
        };
        this.sendChannel.onclose = function (event) {
            console.log("sendChannel onclose", event);
        };

        this.peerConnection.ondatachannel = function (event) {
            console.log("sendChannel ondatachannel");
            context.receiveChannel = event.channel;
            context.receiveChannel.onopen = function () {
                console.log("receiveChannel onopen");
            };
            context.receiveChannel.onclose = function (evt) {
                console.log("receiveChannel onclose", evt);
            };

            context.receiveChannel.onmessage = function (evt) {
                console.log("receiveChannel onmessage");
                const customEvent = new CustomEvent('dataChannelMessageReceived', { bubbles: true, detail: evt });
                document.dispatchEvent(customEvent);
            };
        };
    }

    sendOffer() {
        let context = this;

        this.sendTracks();
        this.peerConnection.createOffer(function (sdp) {
            console.log(`sendOffer to ${context.email}`)
            context.peerConnection.setLocalDescription(sdp);
            socketIOMeetingRoom.socket.emit("offer", { "fromEmail": storage.getUname(), "toEmail": context.email, "sdp": sdp, "room": storage.getRoomCode() });
        }, function (error) {
            console.log("sendOffer", error)
        });
    }

    sendAnswer(data) {
        let context = this;
        let pAnswer = null;
        context.sendTracks();
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(data["sdp"]));
        context.peerConnection.createAnswer().then(function (answer) {
            pAnswer = answer;
            return context.peerConnection.setLocalDescription(answer);
        })
            .then(function () {
                console.log(`onOffer to ${context.email}`)
                socketIOMeetingRoom.socket.emit("answer", { "fromEmail": storage.getUname(), "toEmail": context.email, "sdp": pAnswer, "room": storage.getRoomCode() });
            })
            .catch(e => console.log(e));
    }

    onTrack(ev) {
        console.log(`onTrack from ${this.email}`)
        let context = this;
        if (ev.streams && ev.streams[0]) {
            context.onReceiveVideo(ev.streams[0]);
        }
    };

    onReceiveVideo(tmpMedia) {
        console.log(`onReceiveVideo track from ${this.email}`, tmpMedia)
        console.log(this.videoElem)
        this.videoElem.srcObject = tmpMedia;

        let activeVideo = document.getElementById(`activeVideo`);
        if (!activeVideo.srcObject) {
            activeVideo.srcObject = tmpMedia;
        }
    }

    onReceiveScreen(tmpMedia) {
        console.log(`onReceiveScreen track from ${this.email}`)
        var screenVideo = document.querySelector(`#activeVideo`)[0];
        console.log(screenVideo);
        screenVideo.srcObject = tmpMedia;
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
