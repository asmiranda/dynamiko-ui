class MeetingRoom {
    constructor() {
        this.roomName;
        this.localStream;

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

    async init(constraints) {
        var context = this;
        try {
            context.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (e) {
            context.handleError(e);
        }
    }

    shareVideo() {
        var context = this;
        var constraints = window.constraints = {
            audio: false,
            video: true
        };
        this.init(constraints);

        var activeVideo = document.querySelector('#activeVideo');
        var myVideo = document.querySelector('#myVideo');
        activeVideo.srcObject = context.localStream;
        myVideo.srcObject = context.localStream;
    }

    join(roomName) {
        console.log(`Joining Room ${roomName}`);
        this.roomName = roomName;
        var context = this;

        var successRoomPopup = function (data) {
            // do anything here
        }
        var successCallback = function (data) {
            showModalAny1200.show(`Joining Room ${context.roomName}`, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
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


