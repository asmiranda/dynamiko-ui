class P2P {
    constructor(email, profile) {
        this.email = email;
        this.profile = profile;

        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };

        this.peerConnection;
        this.dataChannel;
        this.remoteStream;
    }

    initP2P(iceCallback) {
        var context = this;
        $("#messageAlert").html(`${context.profile} joined!`);

        context.peerConnection = new RTCPeerConnection(context.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });
        context.peerConnection.onnegotiationneeded = function() {
            context.peerConnection.createOffer(function (description) {
                context.peerConnection.setLocalDescription(description);
                var strMessage = JSON.stringify({
                    'sdp': description
                });
                console.log(description);
                // strMessage = "This is a sample message, just to tame frame size.";
                
                var oldP2P = allP2P.get(context.email);
                if (oldP2P) {
                    var chunkSize = 2000;
                    dataChunkSender.sendToSocket(roomSignal, chunkSize, 'req-offer-change', context.email, strMessage);
                }
                else {
                    roomSignal.send("req-offer", context.email, strMessage);
                }
            }, function (error) {
                alert("Error creating an offer-change");
            });
        };

        context.initDataChannel();

        var track = mediaStream.localStream.getTracks()[0];
        context.peerConnection.addTrack(track, mediaStream.localStream);

        if (screenShare.localStream) {
            var trackScreen = screenShare.localStream.getVideoTracks()[0];
            context.peerConnection.addTrack(trackScreen, screenShare.localStream);
        }

        context.peerConnection.onicecandidate = iceCallback;

        context.peerConnection.ontrack = function(ev) {
            if (ev.streams && ev.streams[0]) {
                context.onTrackVideo(ev.streams[0]);
            }
            if (ev.streams && ev.streams[1]) {
                context.onTrackScreen(ev.streams[1]);
            }
        };
    }

    onTrackVideo(tmpMedia) {
        var context = this;
        console.log("remote video track.")
        var videoElem = document.querySelectorAll(`video.miniVideoStream[email="${context.email}"]`)[0];
        if (videoElem==undefined) {
            context.createVideoBox();
            videoElem = document.querySelectorAll(`video.miniVideoStream[email="${context.email}"]`)[0];
        }
        console.log(videoElem);
        videoElem.srcObject = tmpMedia;
    }

    onTrackScreen(tmpMedia) {
        alert("Screen Sharang....");
        console.log("remote screen track.")
        var videoElem = document.querySelectorAll(`#activeVideo`)[0];
        console.log(videoElem);
        videoElem.srcObject = tmpMedia;
    }

    startOffer(offerCallback) {
        var context = this;

        // context.peerConnection.createOffer(function (description) {
        //     context.peerConnection.setLocalDescription(description);
        //     offerCallback();
        // }, function (error) {
        //     alert("Error creating an offer");
        // });
    }

    initDataChannel() {
        var context = this;
        console.log("Create Data Channel");
        context.dataChannel = context.peerConnection.createDataChannel("dataChannel");

        context.dataChannel.onerror = function (error) {
            console.log("Error occured on datachannel:", error);
        };

        // when we receive a message from the other peer, printing it on the console
        context.dataChannel.onmessage = function (event) {
            console.log("message:", JSON.stringify(event.data));
        };

        context.dataChannel.onclose = function () {
            console.log("data channel is closed");
        };
    }

    doOffer(offer, doOfferCallback) {
        var context = this;
        var signal = JSON.parse(offer);
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        context.peerConnection.createAnswer().then(function (answer) {
            return context.peerConnection.setLocalDescription(answer);
        })
            .then(function () {
                doOfferCallback();
            })
            .catch(e => console.log(e));
    };

    doIce(ice) {
        var context = this;
        var objData = JSON.parse(ice);
        context.peerConnection.addIceCandidate(new RTCIceCandidate(objData.ice));
    };

    doAnswer(answer) {
        var context = this;
        var objData = JSON.parse(answer);
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(objData.sdp));
    };

    createVideoBox() {
        var context = this;
        if (!$(`.miniVideo[email="${context.email}"]`).length) {
            var str = `
                <div style="flex: 1; width: 100px; display: flex; flex-direction: column; margin-bottom: 10px;" class="miniVideo" email="${context.email}">
                    <video class="miniVideoStream" email="${context.email}" style="width: 100px; max-height: 100px; background-color: cornflowerblue;" autoplay playsinline></video>
                    <div class="text-center" style="width: 100px; color:white;">${context.profile}</div>
                </div>
            `;
            $(".videoBoxList").append(str);
        }
    }
}