class MeetingRoom {
    constructor() {
        this.roomName;
        this.localStream;
        this.activeVideo;
        this.myVideo;
        this.remoteVideo;
        this.constraints = window.constraints = {
            audio: false,
            video: true
        };

        $(document).on('click', `.btnCall`, function () {
            meetingRoom.call();
        });
        $(document).on('click', `.btnShareVideo`, function () {
            meetingRoom.shareVideo();
        });
        $(document).on('click', `.btnShareAudio`, function () {
            meetingRoom.shareAudio();
        });
        $(document).on('click', `.btnInviteUser`, function () {
            meetingRoom.inviteUser();
        });
        $(document).on('click', `.btnRecordMeeting`, function () {
            meetingRoom.recordMeeting();
        });
    }

    call() {
        var context = this;
        chatInitializer.offer();
    }

    async init() {
        var context = this;
        try {
            this.activeVideo = document.querySelector('#activeVideo');
            this.myVideo = document.querySelector('#myVideo');
            this.remoteVideo = document.querySelector('#remoteVideo');

            context.localStream = await navigator.mediaDevices.getUserMedia(context.constraints);

            chatInitializer.init(context.roomName, context.localStream, context.localVideo, context.remoteVideo);
        } catch (e) {
            context.handleError(e);
        }
    }

    shareVideo() {
        this.activeVideo.srcObject = this.localStream;
        this.myVideo.srcObject = this.localStream;
    }

    join(roomName) {
        console.log(`Joining Room ${roomName}`);
        this.roomName = roomName;
        var context = this;

        var successRoomPopup = function (data) {
            context.init();
        }
        var successCallback = function (data) {
            showModalAny1200.show(`Joining Room ${context.roomName}`, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = this.constraints.video;
            showModalAny.show("Error", `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            showModalAny.show("Error", 'Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        showModalAny.show("Error", `getUserMedia error: ${error.name}`);
    }
}

$(function () {
    meetingRoom = new MeetingRoom();
});


