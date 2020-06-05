class MeetingRoom {
    constructor() {
        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };
        this.mediaConstraints = window.constraints = {
            audio: false,
            video: true
        };

        this.prevConCompany;
        this.prevConRoom;
        this.localStream;
        this.peerConnection;
        this.dataChannel;
        this.input = document.getElementById("messageInput");

        var context = this;

        $(document).on('click', `.btnSendChat`, function () {
            context.sendMessage();
        });
        $(document).on('click', `.btnShareVideo`, function () {
            context.shareVideo();
        });
    }

    startSignal() {
        var context = this;
        if (this.sockjs) {

        }
        this.sockjs = new SockJS(`${MAIN_URL}/socket/1/1`);

        context.sockjs.onopen = function () {
            console.log("Connected to the signaling server");
        };
        context.sockjs.onclose = function () {
            console.log('close');
        };
        context.sockjs.onmessage = function (msg) {
            console.log("Got message", msg.data);
            var content = JSON.parse(msg.data);
            var data = content.data;
            switch (content.event) {
                // when somebody wants to call us
                case "offer":
                    context.handleOffer(data);
                    break;
                case "answer":
                    context.handleAnswer(data);
                    break;
                // when a remote peer sends an ice candidate to us
                case "candidate":
                    context.handleCandidate(data);
                    break;
                default:
                    break;
            }
        };
    }

    shareVideo() {
        var context = this;

        const activeVideo = document.getElementById('activeVideo');
        activeVideo.srcObject = context.localStream;

        const myVideo = document.querySelector('video#myVideo');
        myVideo.srcObject = context.localStream;

        context.peerConnection.addStream(context.localStream);  
    }

    send(message) {
        this.sockjs.send(JSON.stringify(message));
    }

    displayRemoteStream(event) {
        var video = document.querySelectorAll('video#remoteVideo');

        // video.src = window.URL.createObjectURL(event.stream);
        video.srcObject = event.stream;
        video.muted = true;
    }

    initP2P() {
        var context = this;

        context.peerConnection = new RTCPeerConnection(context.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });

        // Setup ice handling
        context.peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                context.send({
                    event: "candidate",
                    data: event.candidate
                });
            }
        };

        context.peerConnection.onaddstream = function () {
            context.displayRemoteStream(event)
        }
        context.peerConnection.addStream(context.localStream);  

        // creating data channel
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

        context.peerConnection.createOffer(function (offer) {
            context.send({
                event: "offer",
                data: offer
            });
            context.peerConnection.setLocalDescription(offer);
        }, function (error) {
            alert("Error creating an offer");
        });
    }

    handleOffer(offer) {
        var context = this;
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        // create and send an answer to an offer
        context.peerConnection.createAnswer(function (answer) {
            context.peerConnection.setLocalDescription(answer);
            context.send({
                event: "answer",
                data: answer
            });
        }, function (error) {
            alert("Error creating an answer");
        });

    };

    handleCandidate(candidate) {
        var context = this;
        context.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    handleAnswer(answer) {
        var context = this;
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("connection established successfully!!");
    };

    sendMessage() {
        var context = this;
        var messageText = $('textarea#chatMessageTxt').val();
        context.dataChannel.send(messageText);
        $('textarea#chatMessageTxt').val("");
    }

    messageCallback(msg) {
        console.log("Got message", msg.data);
    }

    join(roomName, conCompany, conRoom) {
        this.roomName = roomName;
        this.conCompany = conCompany;
        this.conRoom = conRoom;
        var title = `Joining Room ${roomName} [C${conCompany} - R${conRoom}]`;
        console.log(title);
        var context = this;

        var successRoomPopup = function (data) {
            roomSignal.joinRoom(conCompany, conRoom, context.messageCallback);
            // context.initAll(event);
        }
        var successCallback = function (data) {
            showModalAny1200.show(title, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }

    async initAll(e) {
        var context = this;
        try {
            context.localStream = await navigator.mediaDevices.getUserMedia(context.mediaConstraints);

            const video = document.getElementById("myVideo");
            video.srcObject = context.localStream;

            context.initP2P();
        } catch (e) {
            context.handleError(e);
        }
    }

    handleError(error) {
        var context = this;
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            context.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            context.errorMsg('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        context.errorMsg(`getUserMedia error: ${error.name}`, error);
    }

    errorMsg(msg, error) {
        const errorElement = document.getElementById('errorMsg');
        errorElement.innerHTML += `<p>${msg}</p>`;
        if (typeof error !== 'undefined') {
            console.error(error);
        }
    }
}

$(function () {
    meetingRoom = new MeetingRoom();
});

