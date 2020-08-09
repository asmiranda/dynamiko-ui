class MobileSocketIOMediaStream {
    constructor() {
        this.localVideo;

        this.videoSharing = true;
        this.audioSharing = true;
        this.screenSharing = false;
    }

    getMediaConstraints() {
        var context = this;

        var mediaConstraints = {
            audio: context.audioSharing,
            video: context.videoSharing
        };
        return mediaConstraints;
    }

    initVideo(mediaSuccessCallback) {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(mobileSocketIOMediaStream.getMediaConstraints())
                .then(function (stream) {
                    mobileSocketIOMediaStream.localVideo = stream;
                })
                .then(function () {
                    mobileSocketIOMediaStream.initialize();
                    mediaSuccessCallback();
                })
        }
    }

    shareScreen() {
        if (this.screenSharing != true) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia(screenShare.mediaConstraints)
                    .then(function (stream) {
                        screenShare.localVideo = stream;

                        allP2P.forEach(function (value, key) {
                            var myP2P = value;

                            var videoElem = document.querySelectorAll(`#activeVideo`)[0];
                            console.log(videoElem);
                            videoElem.srcObject = screenShare.localVideo;

                            var trackScreen = screenShare.localVideo.getVideoTracks()[0];
                            myP2P.peerConnection.addTrack(trackScreen, screenShare.localVideo);
                        });
                    })
                    .then(function () {
                        screenShare.initialize();
                    })
            }
        }
        else {
            screenShare.localVideo.getVideoTracks()[0].enabled = true;
        }
        this.screenSharing = true;
    }

    initialize(e) {
        const video = document.getElementById("myVideo");
        video.srcObject = mobileSocketIOMediaStream.localVideo;
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            mobileSocketIOMediaStream.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            mobileSocketIOMediaStream.errorMsg('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        mobileSocketIOMediaStream.errorMsg(`getUserMedia error: ${error.name}`, error);
    }

    errorMsg(msg, error) {
        const errorElement = document.getElementById('errorMsg');
        errorElement.innerHTML += `<p>${msg}</p>`;
        if (typeof error !== 'undefined') {
            console.error(error);
        }
    }

}
