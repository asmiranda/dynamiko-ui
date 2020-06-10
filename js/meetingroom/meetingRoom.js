class MeetingRoom {
    constructor() {
        $(document).on('click', `.btnMeetingSignOut`, function() {
            meetingRoom.clickSignOut(this);
        });
        $(document).on('click', `.btnEndMeeting`, function() {
            meetingRoom.clickEndMeeting(this);
        });
        $(document).on('click', `.btnShareVideo`, function() {
            meetingRoom.clickShareVideo(this);
        });
        $(document).on('click', `.miniVideoStream`, function() {
            meetingRoom.focusMiniVideoStream(this);
        });
        $(document).on('click', `.btnToggleChat`, function() {
            meetingRoom.toggleChat(this);
        });
        $(document).on('click', `.btnToggleOtherUsers`, function() {
            meetingRoom.toggleOtherUsers(this);
        });
        
    }

    toggleOtherUsers() {
        if ($(".videoBoxList").is(":visible")){
            $(".videoBoxList").hide();
        } else {
            $(".videoBoxList").show();
        }
    }

    toggleChat() {
        if ($("#myChatBox").is(":visible")){
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

    messageCallback(msg) {
        var context = this;
        console.log("Got message", msg.data);
        var jsonMsg = JSON.parse(msg.data);

        var action = jsonMsg.action;
        var from = jsonMsg.from;
        var data = jsonMsg.data;

        meetingRoom.log(action, from);
        if ("do-end-meeting"==action) {
            meetingRoom.doEndMeeting(from);
        }
        else if ("do-sign-out"==action) {
            meetingRoom.doSignOut(from);
        }
        else if ("do-active-users"==action) {
            meetingRoom.doActiveUsers(data);
        }
        else if ("do-offer"==action) {
            meetingRoom.doOffer(from, data);
        }
        else if ("do-offer-screen"==action) {
            meetingRoom.doOfferScreen(from, data);
        }
        else if ("do-answer"==action) {
            meetingRoom.doAnswer(from, data);
        }
        else if ("do-answer-screen"==action) {
            meetingRoom.doAnswerScreen(from, data);
        }
        else if ("do-ice"==action) {
            meetingRoom.doIce(from, data);
        }
        else if ("do-ice-screen"==action) {
            meetingRoom.doIceScreen(from, data);
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
            audioVideoStream.initMedia(function() {
                roomSignal.init(conCompany, conRoom, context.messageCallback);
                roomSignal.send("req-join", "all", PROFILENAME);
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

        audioVideoStream.initMedia(function() {
            roomSignal.init(conCompany, conRoom, context.messageCallback);
            roomSignal.send("req-join", "all", PROFILENAME);
        });
    }
    
    doActiveUsers(data) {
        console.log(data);
        $(".selectChatTo").empty();
        $(".selectChatTo").append(`<option value="All">All</option>`);
        allP2P = new Map();
        $(data).each(function(index, obj) {
            var email = obj.key;
            if  (email!=USERNAME) {
                var profile = obj.value;
                var opt = `<option value="${email}">${profile}</option>`;
                $(".selectChatTo").append(opt);
    
                var p2p = new P2P(email, profile);
                allP2P.set(email, p2p);
                p2p.initP2P(
                    function(event) {
                        roomSignal.send("req-ice", email, JSON.stringify({ 'ice': event.candidate }));
                    }, 
                    function(event) {
                        roomSignal.send("req-ice-screen", email, JSON.stringify({ 'ice': event.candidate }));
                    }
                );
                p2p.startOffer(
                    function() {
                        roomSignal.send("req-offer", email, JSON.stringify({ 'sdp': p2p.peerConnection.localDescription }));
                    }, 
                    function() {
                        roomSignal.send("req-offer-screen", email, JSON.stringify({ 'sdp': p2p.peerScreenConnection.localDescription }));
                    }
                );
            }
        });
    }

    doOffer(from, obj) {
        var email = obj.from;
        var profile = obj.profile;
        var data = obj.data;

        var opt = `<option value="${email}">${profile}</option>`;
        $(".selectChatTo").append(opt);

        var p2p = new P2P(email, profile);
        p2p.initP2P();
        p2p.doOffer(data, function() {
            console.log(`Sending answer to ${email} with sdp = `, p2p.peerConnection.localDescription);
            roomSignal.send("req-answer", email, JSON.stringify({ 'sdp': p2p.peerConnection.localDescription}));
            console.log(`Answer sent.`);
        });
        allP2P.set(email, p2p);
    }

    doOfferScreen(from, data) {
        var email = from;

        var p2p = allP2P.get(email);
        p2p.doOfferScreen(data, function() {
            console.log(`Sending answer screen to ${email} with sdp = `, p2p.peerScreenConnection.localDescription);
            roomSignal.send("req-answer-screen", email, JSON.stringify({ 'sdp': p2p.peerScreenConnection.localDescription}));
            console.log(`Answer screen sent.`);
        });
        allP2P.set(email, p2p);
    }

    doAnswer(from, data) {
        var myP2P = allP2P.get(from);
        myP2P.doAnswer(data);

        console.log(`connection to ${from} established successfully!!`);
    };

    doAnswerScreen(from, data) {
        var myP2P = allP2P.get(from);
        myP2P.doAnswerScreen(data);

        console.log(`connection (screen) to ${from} established successfully!!`);
    };

    doIce(from, data) {
        var myP2P = allP2P.get(from);
        myP2P.doIce(data);
    };

    doIceScreen(from, data) {
        var myP2P = allP2P.get(from);
        myP2P.doIce(data);
    };

    clickUnshareVideo() {
    }

    clickShareVideo() {
        // var context = this;

        // const myVideo = document.querySelector('video#myVideo');
        // myVideo.srcObject = audioVideoStream.localStream;

        // allP2P.forEach(function logMapElements(value, key, map) {
        //     var myP2P = value;
        //     console.log(`m[${key}] = ${value}`);
        //     for (const track of audioVideoStream.localStream.getTracks()) {
        //         console.log(`log tracks.`);
        //         myP2P.peerConnection.addTrack(track, audioVideoStream.localStream);
        //     }
        // });
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
        if (p2p!=null) {
            p2p.removeBox();
        }
        allP2P.delete(from);
    }

    log(action, peer) {
        $('#allChatMessages').append(action+"\t\t\t"+peer+"\n");
    }
}

var meetingRoomSignal;
$(function () {
    allP2P = new Map();
    audioVideoStream = new AudioVideoStream();
    roomSignal = new RoomSignal();

    screenShare = new ScreenShare();
    // roomSignal = new RoomSignal();

    meetingRoom = new MeetingRoom();

    window.onbeforeunload = meetingRoom.doSignOut();
    window.onunload = meetingRoom.doSignOut();
});
