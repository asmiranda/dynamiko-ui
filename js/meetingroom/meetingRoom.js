class MeetingRoom {
    constructor() {
        $(document).on('click', `#btnSendChatMessage`, function () {
            meetingRoom.sendChatMessage(this);
        });
        $(document).on('keyup', `#txtChatMessage`, function (e) {
            if (e.key === 'Enter') {
                meetingRoom.sendChatMessage(this);
            }
        });
        $(document).on('click', `.changeSendTo`, function () {
            meetingRoom.changeSendTo(this);
        });


        $(document).on('click', `.btnMeetingSignOut`, function () {
            meetingRoom.clickSignOut(this);
        });
        $(document).on('click', `.btnEndMeeting`, function () {
            meetingRoom.clickEndMeeting(this);
        });

        $(document).on('click', `.btnShareVideo`, function () {
            meetingRoom.clickShareVideo(this);
        });
        $(document).on('click', `.btnUnShareVideo`, function () {
            meetingRoom.clickUnShareVideo(this);
        });
        $(document).on('click', `.btnShareAudio`, function () {
            meetingRoom.clickShareAudio(this);
        });
        $(document).on('click', `.btnUnShareAudio`, function () {
            meetingRoom.clickUnShareAudio(this);
        });
        $(document).on('click', `.btnShareContent`, function () {
            meetingRoom.clickShareContent(this);
        });
        $(document).on('click', `.btnUnShareContent`, function () {
            meetingRoom.clickUnShareContent(this);
        });

        $(document).on('click', `.miniVideoStream`, function () {
            meetingRoom.focusMiniVideoStream(this);
        });

        $(document).on('click', `.btnToggleChat`, function () {
            meetingRoom.toggleChat(this);
        });
        $(document).on('click', `.btnToggleOtherUsers`, function () {
            meetingRoom.toggleOtherUsers(this);
        });

        $(document).on('click', `.btnMinimizeToRight`, function () {
            meetingRoom.minimizeToRight(this);
        });
        $(document).on('click', `.btnToggleMiniVideo`, function () {
            meetingRoom.toggleMiniVideo(this);
        });
        $(document).on('click', `#myVideoMinimize`, function () {
            meetingRoom.myVideoMaximize(this);
        });

    }

    myVideoMaximize() {
        alertConfirmActiveModal.toggle();
        $("#myVideoMinimize").hide();
    }

    toggleMiniVideo() {
        if ($("#myVideoMinimize").is(":visible")) {
            $("#myVideoMinimize").hide();
        } else {
            $("#myVideoMinimize").show();
        }
    }

    minimizeToRight() {
        var activeVideoElem = document.querySelectorAll(`video#activeVideo`)[0];
        var minimizeVideoElem = document.querySelectorAll(`video#myVideoMinimize`)[0];

        minimizeVideoElem.srcObject = activeVideoElem.srcObject;

        alertConfirmActiveModal.toggle();
        $("#myVideoMinimize").show();
    }

    toggleOtherUsers() {
        if ($(".videoBoxList").is(":visible")) {
            $(".videoBoxList").hide();
        } else {
            $(".videoBoxList").show();
        }
    }

    toggleChat() {
        if ($("#myChatBox").is(":visible")) {
            $("#myChatBox").hide();
        } else {
            $("#myChatBox").show();
        }
    }

    focusMiniVideoStream(obj) {
        var videoElem = document.querySelectorAll(`video#activeVideo`)[0];
        console.log(videoElem);

        videoElem.srcObject = obj.srcObject;
    }

    completeSignOut(obj) {
        $(".jconfirm").hide();
        roomSignal.close();

        allP2P.clear();
        allP2P = new Map();
    }

    changeSendTo(obj) {
        var sendTo = $(obj).attr("sendTo");
        $('#sendChatMessageTo').val(sendTo);
    }

    sendChatMessage(obj) {
        var sendChatMessageTo = $('#sendChatMessageTo').val();
        var message = $("#txtChatMessage").val();

        chatMessageWriter.writeToChatForMe(message);
        chatMessageWriter.sendChatToOthers(sendChatMessageTo, message);
    }

    dataChannelCallback(ev) {
        var sentFrom = ev.currentTarget.label;
        var msg = ev.data;
        if (msg.startsWith("chat|")) {
            chatMessageWriter.writeToChatFromSender(sentFrom, msg);
        }
    }

    messageCallback(msg) {
        var context = this;
        console.log("Got message", msg.data);
        var jsonMsg = JSON.parse(msg.data);

        var action = jsonMsg.action;
        var from = jsonMsg.from;
        var data = jsonMsg.data;

        if ("do-end-meeting" == action) {
            meetingRoom.doEndMeeting(from);
        }
        else if ("do-sign-out" == action) {
            meetingRoom.doSignOut(from);
        }
        else if ("do-active-users" == action) {
            meetingRoom.doActiveUsers(data);
        }
        else if ("do-offer" == action) {
            meetingRoom.doOffer(from, data);
        }
        else if ("do-offer-change" == action) {
            meetingRoom.doOfferChange(from, data);
        }
        else if ("do-answer" == action) {
            meetingRoom.doAnswer(from, data);
        }
        else if ("do-answer-change" == action) {
            meetingRoom.doAnswerChange(from, data);
        }
        else if ("do-ice" == action) {
            meetingRoom.doIce(from, data);
        }
    }

    join(roomName, conCompany, conRoom) {
        this.roomName = roomName;
        this.conCompany = conCompany;
        this.conRoom = conRoom;
        var title = `Joining Room ${roomName} [C${conCompany} - R${conRoom}]`;
        console.log(title);
        var context = this;

        var successRoomPopup = function (data) {
            mediaStream.initMedia(function () {
                roomSignal.init(conCompany, conRoom, context.messageCallback);
                roomSignal.send("req-join", "all", storage.profileName);
            });
        }
        var successCallback = function (data) {
            showModalAny1200NoButtons.show(title, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }

    joinNoPopup(roomName, conCompany, conRoom) {
        this.roomName = roomName;
        this.conCompany = conCompany;
        this.conRoom = conRoom;
        var context = this;

        mediaStream.initMedia(function () {
            roomSignal.init(conCompany, conRoom, context.messageCallback);
            roomSignal.send("req-join", "all", storage.profileName);
        });
    }

    doActiveUsers(data) {
        var context = this;
        console.log(data);
        $(".selectChatTo").empty();
        $(".selectChatTo").append(`<option value="All">All</option>`);
        allP2P = new Map();
        $(data).each(function (index, obj) {
            var email = obj.key;
            if (email != storage.uname) {
                var profile = obj.value;
                var opt = `<option value="${email}">${profile}</option>`;
                $(".selectChatTo").append(opt);

                context.newP2P(email, profile);
            }
        });
    }

    newP2P(email, profile) {
        var context = this;
        var p2p = new P2P(email, profile, context.dataChannelCallback);
        allP2P.set(email, p2p);
        p2p.initP2P(
            function (event) {
                if (event.candidate != null) {
                    roomSignal.send("req-ice", email, JSON.stringify({ 'ice': event.candidate }));
                }
                else {
                    console.log("ICE is null");
                }
            }
        );
        p2p.startOffer(
            function () {
                roomSignal.send("req-offer", email, JSON.stringify({ 'sdp': p2p.peerConnection.localDescription }));
            }
        );
    }

    doOffer(from, obj) {
        var email = obj.from;
        var profile = obj.profile;
        var data = obj.data;

        var opt = `<option value="${email}">${profile}</option>`;
        $(".selectChatTo").append(opt);

        var context = this;
        var p2p = new P2P(email, profile, context.dataChannelCallback);
        p2p.initP2P();
        p2p.doOffer(data, function () {
            console.log(`Sending answer to ${email} with sdp = `, p2p.peerConnection.localDescription);
            roomSignal.send("req-answer", email, JSON.stringify({ 'sdp': p2p.peerConnection.localDescription }));
            console.log(`Answer sent.`);
        });
        allP2P.set(email, p2p);
    }

    doOfferChange(from, data) {
        var p2p = allP2P.get(from);
        p2p.doOffer(data, function () {
            console.log(`Sending change answer to ${from} with sdp = `, p2p.peerConnection.localDescription);
            var strMessage = JSON.stringify({ 'sdp': p2p.peerConnection.localDescription });

            var chunkSize = 2000;
            dataChunkSender.sendToSocket(roomSignal, chunkSize, 'req-answer-change', from, strMessage);
            console.log(`Answer change sent.`);
        });
    }

    doAnswer(from, data) {
        var myP2P = allP2P.get(from);
        myP2P.doAnswer(data);

        console.log(`connection to ${from} established successfully!!`);
    };

    doAnswerChange(from, data) {
        var myP2P = allP2P.get(from);
        myP2P.doAnswer(data);

        console.log(`change answer to ${from} is successful!!`);
    };

    doIce(from, data) {
        var myP2P = allP2P.get(from);
        myP2P.doIce(data);
    };

    clickUnShareVideo() {
        mediaStream.localStream.getVideoTracks()[0].enabled = false;
    }

    clickShareVideo() {
        mediaStream.localStream.getVideoTracks()[0].enabled = true;
    }

    clickUnShareAudio() {
        mediaStream.localStream.getAudioTracks()[0].enabled = false;
    }

    clickShareAudio() {
        mediaStream.localStream.getAudioTracks()[0].enabled = true;
    }

    clickUnShareContent() {
        screenShare.localStream.getVideoTracks()[0].enabled = false;
    }

    clickShareContent() {
        mediaStream.shareScreen();
    }

    clickSignOut() {
        roomSignal.send("req-sign-out", "all", "Meeting Ended.");
        this.completeSignOut();
    }

    clickEndMeeting() {
        roomSignal.send("req-end-meeting", "all", "Meeting Ended.");
        this.completeSignOut();
    }

    doEndMeeting(from) {
        $(`#messageAlert`).html(`Meeting has ended.`);
        meetingRoom.completeSignOut();
    }

    doSignOut(from) {
        $(`#messageAlert`).html(`${from} signed out.`);

        var p2p = allP2P.get(from);
        if (p2p != null) {
            p2p.removeBox();
        }
        allP2P.delete(from);
    }

    log(str) {
        var display = `
            <div>
                <p class="message">
                    ${str}
                </p>
            </div>
        `;
        $('#chat-box').append(display);
    }
}

var meetingRoomSignal;
$(function () {
    allP2P = new Map();
    mediaStream = new MediaStream();
    roomSignal = new RoomSignal();

    screenShare = new ScreenShare();
    chatMessageWriter = new ChatMessageWriter();
    // roomSignal = new RoomSignal();

    meetingRoom = new MeetingRoom();

    window.onbeforeunload = meetingRoom.doSignOut();
    window.onunload = meetingRoom.doSignOut();
});
