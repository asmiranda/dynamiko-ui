class MeetingRoom {
    constructor() {
        $(document).on('click', `.btnSignOut`, function() {
            meetingRoom.sendSignOut(this);
        });
        $(document).on('click', `.btnEndMeeting`, function() {
            meetingRoom.sendEndMeeting(this);
        });
        $(document).on('click', `.btnShareVideo`, function() {
            meetingRoom.shareVideo(this);
        });
    }

    signOut(obj) {
        allP2P.clear();
        $(".jconfirm").hide();
    }

    endMeeting(obj) {
        allP2P.clear();
        $(".jconfirm").hide();
        if (meetingRoomSignal!=null) {
            meetingRoomSignal.close();
        }
    }

    messageCallback(msg) {
        var context = this;
        console.log("Got message", msg.data);
        var jsonMsg = JSON.parse(msg.data);

        var action = jsonMsg.action;
        var from = jsonMsg.from;
        var data = jsonMsg.data;

        if ("meeting-ended"==action) {
            meetingRoom.endMeeting();
        }
        else if ("signed-out"==action) {
            meetingRoom.signOut();
        }
        else if ("user-joined"==action) {
            meetingRoom.userJoined(from, data);
        }
        else if ("start-offer"==action) {
            meetingRoom.startOffering(from, data);
        }
        else if ("offer"==action) {
            var myP2P = allP2P.get(from);
            myP2P.handleOffer(data);
        }
        else if ("answer"==action) {
            var myP2P = allP2P.get(from);
            myP2P.handleAnswer(data);
        }
        else if ("candidate"==action) {
            var myP2P = allP2P.get(from);
            myP2P.handleCandidate(data);
        }
        else if ("answer-accepted"==action) {
            var myP2P = allP2P.get(from);
            myP2P.handleAnswerAccepted(data);
        }
    }

    sendSignOut() {
        roomSignal.send("sign-out", "all", "Sign Out.");
    }

    sendEndMeeting() {
        if (meetingRoomSignal!=null) {
            meetingRoomSignal.close();
        }
        roomSignal.send("end-meeting", "all", "Meeting Ended.");
    }

    startOffering(from, data) {
        var context = this;
        console.log(data);
        $(data).each(function(index, str) {
            if (str.key!=USERNAME) {
                var p2p = allP2P.get(str.key);
                p2p.startOffer();
            }
        });
    }

    userJoined(from, data) {
        var context = this;
        console.log(data);
        $(".selectChatTo").empty();
        $(".selectChatTo").append(`<option value="All">All</option>`);
        $(data).each(function(index, str) {
            if  (str.key==USERNAME) {
                var opt = `<option value="${str.key}" style="color: red;" disabled>${str.value} (me)</option>`;
                $(".selectChatTo").append(opt);
            }
            else {
                var opt = `<option value="${str.key}">${str.value}</option>`;
                $(".selectChatTo").append(opt);

                var p2pCreated = allP2P.has(str.key);
                if (!p2pCreated) {
                    var p2p = new P2P(str.key, str.value);
                    p2p.initP2P();
                    p2p.createVideoBox();

                    allP2P.set(str.key, p2p);
                }
                else {
                    var p2p = allP2P.get(str.key);
                    p2p.createVideoBox();
                }
            }
        });
    }

    join(roomName, conCompany, conRoom) {
        this.roomName = roomName;
        this.conCompany = conCompany;
        this.conRoom = conRoom;
        var title = `Joining Room ${roomName} [C${conCompany} - R${conRoom}]`;
        console.log(title);
        var context = this;

        var successRoomPopup = function (data) {

            if(navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(audioVideoStream.mediaConstraints)
                    .then(function(stream) {
                        audioVideoStream.localStream = stream;
                    })
                    .then(function() {
                        audioVideoStream.initialize();
                        roomSignal.joinRoom(conCompany, conRoom, context.messageCallback);
                    })
                }
        }
        var successCallback = function (data) {
            showModalAny1200.show(title, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }
    
    unshareVideo() {
    }

    shareVideo() {
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
}

$(function () {
    allP2P = new Map();
    meetingRoom = new MeetingRoom();
});
