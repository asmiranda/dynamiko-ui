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

        this.peerScreenConnection;
        this.remoteScreenStream;
    }

    initP2PStream(iceCallback) {
        var context = this;
        $("#messageAlert").html(`${context.profile} joined!`);

        context.peerConnection = new RTCPeerConnection(context.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });

        context.peerConnection.onicecandidate = iceCallback;

        context.peerConnection.ontrack = function(ev) {
            console.log("remote track.")
            var videoElem = document.querySelectorAll(`video.miniVideoStream[email="${context.email}"]`)[0];
            if (videoElem==undefined) {
                context.createVideoBox();
                videoElem = document.querySelectorAll(`video.miniVideoStream[email="${context.email}"]`)[0];
            }
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

    initP2PScreen(iceCallbackScreen) {
        var context = this;

        context.peerScreenConnection = new RTCPeerConnection(context.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });

        context.peerScreenConnection.onicecandidate = iceCallbackScreen;

        context.peerScreenConnection.ontrack = function(ev) {
            console.log("remote screen track.")
            var videoElem = document.querySelectorAll(`video.screenVideo`)[0];
            console.log(videoElem);

            console.log("on screen track", ev);
            if (ev.streams && ev.streams[0]) {
                videoElem.srcObject = ev.streams[0];
            } else {
                if (!context.remoteScreenStream) {
                    context.remoteScreenStream = new MediaStream();
                    videoElem.srcObject = context.remoteScreenStream;
                }
                context.remoteScreenStream.addTrack(ev.track);
                console.log("remote screen", ev.track);
            }
        };
    }

    initP2P(iceCallback, iceCallbackScreen) {
        var context = this;
        context.initP2PStream(iceCallback);
        context.initP2PScreen(iceCallbackScreen);
    }

    startOffer(offerCallback, offerCallbackScreen) {
        var context = this;

        // creating data channel
        // context.initDataChannel();

        context.peerConnection.createOffer(function (description) {
            context.peerConnection.setLocalDescription(description);
            offerCallback();
        }, function (error) {
            alert("Error creating an offer");
        });

        context.peerScreenConnection.createOffer(function (description) {
            context.peerScreenConnection.setLocalDescription(description);
            offerCallbackScreen();
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

    doOfferScreen(offer, doOfferScreenCallback) {
        var context = this;
        var signal = JSON.parse(offer);
        context.peerScreenConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        context.peerScreenConnection.createAnswer().then(function (answer) {
            return context.peerScreenConnection.setLocalDescription(answer);
        })
            .then(function () {
                doOfferScreenCallback();
            })
            .catch(e => console.log(e));
    };

    doIce(ice) {
        var context = this;
        var objData = JSON.parse(ice);
        context.peerConnection.addIceCandidate(new RTCIceCandidate(objData.ice));
    };

    doIceScreen(ice) {
        var context = this;
        var objData = JSON.parse(ice);
        context.peerScreenConnection.addIceCandidate(new RTCIceCandidate(objData.ice));
    };

    doAnswer(answer) {
        var context = this;
        var objData = JSON.parse(answer);
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(objData.sdp));
    };

    doAnswerScreen(answer) {
        var context = this;
        var objData = JSON.parse(answer);
        context.peerScreenConnection.setRemoteDescription(new RTCSessionDescription(objData.sdp));
    };

    createVideoBox() {
        var context = this;
        if (!$(`.miniVideo[email="${context.email}"]`).length) {
            var str = `
                <div style="flex: 1; width: 100px; display: flex; flex-direction: column;" class="miniVideo" email="${context.email}">
                    <video class="miniVideoStream" email="${context.email}" style="width: 100px; min-height: 100px; max-height: 100px; background-color: cornflowerblue;" autoplay playsinline></video>
                    <div class="text-center" style="width: 100px;">${context.profile}</div>
                </div>
            `;
            $(".videoBoxList").append(str);
        }
    }
}