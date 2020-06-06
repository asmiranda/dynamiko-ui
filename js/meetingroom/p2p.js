class P2P {
    constructor(email, profile) {
        this.email = email;
        this.profile = profile;
        this.peerConnection;
        this.dataChannel;
        this.remoteStream;

        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };
    }

    initP2P() {
        var context = this;
        $("#messageAlert").html(`${context.profile} joined!`);

        context.peerConnection = new RTCPeerConnection(context.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });

        // Setup ice handling
        context.peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                roomSignal.send("candidate", context.email, JSON.stringify({ 'ice': event.candidate }));
            }
        };

        context.peerConnection.ontrack = function(ev) {
            console.log("remote track.")
            // context.displayRemoteStream(ev)
            var videoElem = document.querySelectorAll(`video.miniVideoStream[email="${context.email}"]`)[0];
            console.log(videoElem);

            console.log("on track", ev);
            if (ev.streams && ev.streams[0]) {
                videoElem.srcObject = ev.streams[0];
            } else {
                if (!context.remoteStream) {
                    context.remoteStream = new MediaStream();
                    videoElem.srcObject = context.remoteStream;
                }
                context.remoteStream.addTrack(ev.track);
                console.log("remote stream", ev.track);
            }
        };

        for (const track of audioVideoStream.localStream.getTracks()) {
            console.log("add track", track);
            context.peerConnection.addTrack(track, audioVideoStream.localStream);
        }
    }

    startOffer() {
        var context = this;

        // creating data channel
        // context.initDataChannel();

        context.peerConnection.createOffer(function (description) {
            context.peerConnection.setLocalDescription(description);
            roomSignal.send("offer", context.email, JSON.stringify({ 'sdp': context.peerConnection.localDescription }));
        }, function (error) {
            alert("Error creating an offer");
        });
    }

    initDataChannel() {
        var context = this;
        console.log("Create Data Channel");
        context.dataChannel = context.peerConnection.createDataChannel("dataChannel", {
            reliable: true
        });

        context.dataChannel.onerror = function (error) {
            console.log("Error occured on datachannel:", error);
        };

        // when we receive a message from the other peer, printing it on the console
        context.dataChannel.onmessage = function (event) {
            console.log("message:", event.data);
            var value = $("textarea#allChatMessages").val();
            value += event.data;
            $("textarea#allChatMessages").val(value);
        };

        context.dataChannel.onclose = function () {
            console.log("data channel is closed");
        };
    }

    displayRemoteStream(ev) {
        console.log(`remote track from ${this.email}`);
        var video = document.querySelectorAll(`video.miniVideoStream[email="${this.email}"]`);

        if (ev.streams && ev.streams[0]) {
            video.srcObject = ev.streams[0];
        } else {
            var inboundStream = new MediaStream();
            inboundStream.addTrack(ev.track);
            video.srcObject = inboundStream;
        }
    }

    handleOffer(offer) {
        var context = this;
        var signal = JSON.parse(offer);
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        context.peerConnection.createAnswer().then(function (answer) {
            return context.peerConnection.setLocalDescription(answer);
        })
            .then(function () {
                console.log(`Sending answer to ${context.email} with sdp = `, context.peerConnection.localDescription);
                roomSignal.send("answer", context.email, JSON.stringify({ 'sdp': context.peerConnection.localDescription}));
                console.log(`Answer sent.`);
            })
            .catch(e => console.log(e));
    };

    handleCandidate(candidate) {
        var context = this;
        var objData = JSON.parse(candidate);
        context.peerConnection.addIceCandidate(new RTCIceCandidate(objData.ice));
    };

    handleAnswer(answer) {
        var context = this;
        var objData = JSON.parse(answer);
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(objData.sdp));
        context.peerConnection.addStream(audioVideoStream.localStream);

        roomSignal.send("answer-accepted", context.email, "");
        console.log("connection established successfully!!");
    };

    handleAnswerAccepted(answer) {
        var context = this;
        context.peerConnection.addStream(audioVideoStream.localStream);
    };

    createVideoBox() {
        var context = this;
        if (!$(`.miniVideo[email="${context.email}"]`).length) {
            var str = `
                <div style="flex: 1; width: 100px; display: flex; flex-direction: column;" class="miniVideo" email="${context.email}">
                    <video class="miniVideoStream" email="${context.email}" style="width: 100px; min-height: 100px; max-height: 100px; background-color: cornflowerblue;" autoplay playsinline></video>
                    <div class="text-center">${context.profile}</div>
                </div>
            `;
            $(".videoBoxList").append(str);
        }
    }
}