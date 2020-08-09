class MobileSocketIOScreenShare {
    constructor() {
        this.localStream;
        this.mediaConstraints = window.constraints = {
            audio: false,
            video: true
        };
    }

    initialize(e) {
        const video = document.getElementById("screenVideo");
        video.srcObject = mobileSocketIOScreenShare.localStream;
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            mobileSocketIOScreenShare.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            mobileSocketIOScreenShare.errorMsg('Permissions have not been granted to share your screen');
        }
        mobileSocketIOScreenShare.errorMsg(`getUserDisplay error: ${error.name}`, error);
    }

    errorMsg(msg, error) {
        const errorElement = document.getElementById('errorMsg');
        errorElement.innerHTML += `<p>${msg}</p>`;
        if (typeof error !== 'undefined') {
            console.error(error);
        }
    }

}
