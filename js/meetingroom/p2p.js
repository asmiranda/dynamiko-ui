class P2P {
    constructor(email, profile) {
        this.email = email;
        this.profile = profile;
        this.peerConnection;
        this.dataChannel;

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

        context.createVideoBox();

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

        context.peerConnection.onaddstream = function () {
            context.displayRemoteStream(event)
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

    displayRemoteStream(event) {
        var video = document.querySelectorAll(`video[email="${this.email}"]`);

        // video.src = window.URL.createObjectURL(event.stream);
        video.srcObject = event.stream;
        video.muted = true;
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
        // context.peerConnection.addStream(audioVideoStream.localStream);

        console.log("connection established successfully!!");
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