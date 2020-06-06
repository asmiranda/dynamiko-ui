class AudioVideoStream {
    constructor() {
        this.localStream;
        this.mediaConstraints = window.constraints = {
            audio: false,
            video: true
        };
    }

    initialize(e) {
        const video = document.getElementById("myVideo");
        video.srcObject = audioVideoStream.localStream;
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            audioVideoStream.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            audioVideoStream.errorMsg('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        audioVideoStream.errorMsg(`getUserMedia error: ${error.name}`, error);
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
    audioVideoStream = new AudioVideoStream();
});
