class P2P {
    constructor(email, profile, dataChannelCallback) {
        this.email = email;
        this.profile = profile;

        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };
        this.dataChannelOptions = {
            ordered: false, // do not guarantee order
            maxRetransmits: 5
        };

        this.peerConnection;
        this.dataChannel;
        this.remoteStream;
        this.videoReceived = false;
        this.dataChannelCallback = dataChannelCallback;
    }

    initP2P(iceCallback) {
        var context = this;
        $("#messageAlert").html(`${context.profile} joined!`);

        context.peerConnection = new RTCPeerConnection(context.peerConnectionConfig);
        context.dataChannel = context.peerConnection.createDataChannel(localStorage.uname, context.dataChannelOptions);

        var track = mediaStream.localStream.getTracks()[0];
        context.peerConnection.addTrack(track, mediaStream.localStream);

        if (screenShare.localStream) {
            var trackScreen = screenShare.localStream.getVideoTracks()[0];
            context.peerConnection.addTrack(trackScreen, screenShare.localStream);
        }

        context.peerConnection.onnegotiationneeded = function () {
            context.peerConnection.createOffer(function (description) {
                context.peerConnection.setLocalDescription(description);
                var strMessage = JSON.stringify({
                    'sdp': description
                });
                console.log(description);
                var oldP2P = allP2P.get(context.email);
                if (oldP2P) {
                    // meetingRoom.log("change offer negotiation.");
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

        context.peerConnection.onicecandidate = iceCallback;

        context.peerConnection.ontrack = function (ev) {
            if (ev.streams && ev.streams[0]) {
                if (this.videoReceived) {
                    context.onTrackScreen(ev.streams[0]);
                }
                else {
                    context.onTrackVideo(ev.streams[0]);
                }
                this.videoReceived = true;
            }
        };

        context.peerConnection.ondatachannel = e => {
            var remoteDC = e.channel;
            remoteDC.onmessage = context.dataChannelCallback;

            remoteDC.onopen = function (event) {
                console.debug('Data Channel Open:', event);
                // context.dataChannel.send("chat|All|Data Channel Open!");
            };
            remoteDC.onclose = function (e) {
                console.error(e);
            };
            remoteDC.onerror = function (e) {
                console.error(e);
            };
        };
    }

    onTrackVideo(tmpMedia) {
        var context = this;
        console.log("remote video track.")
        // meetingRoom.log("remote video track.");
        var videoElem = document.querySelectorAll(`video.miniVideoStream[email="${context.email}"]`)[0];
        if (videoElem == undefined) {
            context.createVideoBox();
            videoElem = document.querySelectorAll(`video.miniVideoStream[email="${context.email}"]`)[0];
        }
        console.log(videoElem);
        videoElem.srcObject = tmpMedia;
    }

    onTrackScreen(tmpMedia) {
        // alert("Screen Sharing....");
        // meetingRoom.log("screen sharing.");
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