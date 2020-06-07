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

    doSignOut(obj) {
        $(".jconfirm").hide();
        roomSignal.sendExit();
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

        if ("do-end-meeting"==action) {
            showModalAny.show("Meeting Info", `Meeting has ended.`);
            meetingRoom.doSignOut();
        }
        else if ("do-sign-out"==action) {
            showModalAny.show("Meeting Info", `${from} signed out.`);
            meetingRoom.doSignOut();
        }

        else if ("do-active-users"==action) {
            meetingRoom.doActiveUsers(data);
        }
        else if ("do-join"==action) {
            meetingRoom.doJoin(data);
        }
        else if ("do-offer"==action) {
            var myP2P = allP2P.get(from);
            myP2P.doOffer(data);
        }
        else if ("do-answer"==action) {
            var myP2P = allP2P.get(from);
            myP2P.doAnswer(data);
        }
        else if ("do-ice"==action) {
            var myP2P = allP2P.get(from);
            myP2P.doIce(data);
        }
    }

    sendSignOut() {
        roomSignal.send("req-sign-out", "all", "Meeting Ended.");
        this.doSignOut();
    }

    sendEndMeeting() {
        roomSignal.send("req-end-meeting", "all", "Meeting Ended.");
        this.doSignOut();
    }

    doJoin(data) {
        var context = this;
        console.log(data);
        $(data).each(function(index, str) {
            if (str.key!=USERNAME) {
                var p2p = allP2P.get(str.key);
                p2p.startOffer();
            }
        });
    }

    doActiveUsers(data) {
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

var meetingRoomSignal;
$(function () {
    allP2P = new Map();
    audioVideoStream = new AudioVideoStream();
    meetingRoom = new MeetingRoom();
    roomSignal = new RoomSignal();

    window.onbeforeunload = meetingRoom.sendSignOut();
    window.onunload = meetingRoom.sendSignOut();
});
