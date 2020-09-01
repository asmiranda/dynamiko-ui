class SocketIOP2P {
    constructor() {
        this.transientP2P;
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

    handleShareScreen(obj) {
        this.transientP2P.handleShareScreen();
    }

    handleUnshareScreen(obj) {
        this.transientP2P.handleUnshareScreen();
    }

    unshareScreen() {
        let context = this;
        let connArr = Object.keys(this.peerConnections);
        $(connArr).each(function (index, key) {
            let myP2P = context.peerConnections[key];
            console.log(myP2P);
            myP2P.unshareScreen();
        })
    }

    shareScreen() {
        let context = this;

        screenShare.initScreen(function () {
            let connArr = Object.keys(context.peerConnections);
            $(connArr).each(function (index, key) {
                let myP2P = context.peerConnections[key];
                console.log(myP2P);
                myP2P.shareScreen();
            })
        });
    }

    handleLoadWebinar(obj) {
        let context = this;
        let connArr = Object.keys(this.peerConnections);
        $(connArr).each(function (index, key) {
            let myP2P = context.peerConnections[key];
            console.log(myP2P);
            myP2P.handleLoadWebinar();
        })
    }

    handleUnloadWebinar(obj) {
        // resend all tracks
        let context = this;
        let connArr = Object.keys(this.peerConnections);
        $(connArr).each(function (index, key) {
            let myP2P = context.peerConnections[key];
            console.log(myP2P);
            myP2P.handleUnloadWebinar();
        })
    }

    loadWebinar() {
        let context = this;
        let connArr = Object.keys(this.peerConnections);
        $(connArr).each(function (index, key) {
            let myP2P = context.peerConnections[key];
            console.log(myP2P);
            myP2P.loadWebinar();
        })
    }

    unloadWebinar() {
        let context = this;
        let connArr = Object.keys(this.peerConnections);
        $(connArr).each(function (index, key) {
            let myP2P = context.peerConnections[key];
            console.log(myP2P);
            myP2P.unloadWebinar();
        })
    }

    handleRemoteUnsaveMode() {
        this.transientP2P.handleRemoteUnsaveMode();
    }

    handleRemoteSaveMode(email) {
        this.transientP2P.handleRemoteSaveMode();
    }

    saveBandWidth() {
        let context = this;
        // $(`#remoteVideos`).hide();
        let hostEmail = storage.getHostEmail();
        let connArr = Object.keys(this.peerConnections);
        $(connArr).each(function (index, key) {
            if (key != hostEmail) {
                let myP2P = context.peerConnections[key];
                console.log(myP2P);
                myP2P.saveBandWidth();
            }
        })
    }

    unsaveBandWidth() {
        let context = this;
        // $(`#remoteVideos`).hide();
        let connArr = Object.keys(this.peerConnections);
        $(connArr).each(function (index, key) {
            let myP2P = context.peerConnections[key];
            console.log(myP2P);
            myP2P.unsaveBandWidth();
        })
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
        this.senders;
        this.receivers;
        this.screenSharing;

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

    handleShareScreen(obj) {
        this.screenSharing = true;
        this.receivers = this.peerConnection.getReceivers();
        $(this.receivers).each(function (receiver) {
            console.log(receiver);
        })
    }

    handleUnshareScreen(obj) {
        this.screenSharing = false;
    }

    unshareScreen() {
        screenShare.localScreen.getTracks()[0].enable = false;

        let tmp = { 'dataType': 'UnshareScreen', 'email': this.email, 'message': "UnshareScreen Mode" };
        this.sendChannel.send(JSON.stringify(tmp));
    }

    shareScreen() {
        if (screenShare.localScreen) {
            screenShare.localScreen.getTracks()[0].enable = true;
            for (const track of screenShare.localScreen.getTracks()) {
                this.peerConnection.addTrack(track, screenShare.localScreen);
            }
        }
        // this.sendTracks();

        let tmp = { 'dataType': 'ShareScreen', 'email': this.email, 'message': "ShareScreen Mode" };
        this.sendChannel.send(JSON.stringify(tmp));
        // this.sendOffer();
    }

    handleLoadWebinar(obj) {
        let context = this;
        $(this.senders).each(function (index, sender) {
            console.log("handleLoadWebinar", sender, sender.track);
            for (const track of socketIOMediaStream.localVideo.getTracks()) {
                try {
                    sender.replaceTrack(track);
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }

    handleUnloadWebinar(obj) {
        let context = this;
        $(this.senders).each(function (index, sender) {
            console.log("handleUnloadWebinar", sender, sender.track);
            try {
                context.peerConnection.removeTrack(sender);
            }
            catch (e) {
                console.log(e);
            }
        });
    }

    loadWebinar() {
        try {
            let tmp = { 'dataType': 'LoadWebinar', 'email': this.email, 'message': "Webinar Mode" };
            this.sendChannel.send(JSON.stringify(tmp));
        }
        catch (e) {
            console.log(e);
        }
    }

    unloadWebinar() {
        try {
            let tmp = { 'dataType': 'UnloadWebinar', 'email': this.email, 'message': "Unload Webinar Mode" };
            this.sendChannel.send(JSON.stringify(tmp));
        }
        catch (e) {
            console.log(e);
        }
    }

    handleRemoteUnsaveMode() {
        let context = this;
        $(this.senders).each(function (index, sender) {
            console.log("Enable Sender Track", sender, sender.track);
            for (const track of socketIOMediaStream.localVideo.getTracks()) {
                try {
                    sender.replaceTrack(track);
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }

    handleRemoteSaveMode() {
        let context = this;
        $(this.senders).each(function (index, sender) {
            console.log("Disable Sender Track", sender, sender.track);
            try {
                context.peerConnection.removeTrack(sender);
            }
            catch (e) {
                console.log(e);
            }
        });
    }

    unsaveBandWidth() {
        try {
            let tmp = { 'dataType': 'UnsaveMode', 'email': this.email, 'message': "Unsaving Mode" };
            this.sendChannel.send(JSON.stringify(tmp));
        }
        catch (e) {
            console.log(e);
        }
    }

    saveBandWidth() {
        try {
            let tmp = { 'dataType': 'SaveMode', 'email': this.email, 'message': "Saving Mode" };
            this.sendChannel.send(JSON.stringify(tmp));
        }
        catch (e) {
            console.log(e);
        }
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
        this.senders = this.peerConnection.getSenders();
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
                socketIOP2P.transientP2P = context;
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
