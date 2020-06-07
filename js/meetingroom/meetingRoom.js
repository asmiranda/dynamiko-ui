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

        if ("do-end-meeting"==action) {
            meetingRoom.doEndMeeting(from);
        }
        else if ("do-sign-out"==action) {
            meetingRoom.doSignOut(from);
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

    doJoin(data) {
        var context = this;
        console.log(data);

        var p2p = allP2P.get(data.key);
        if (p2p==null) {
            p2p = new P2P(data.key, data.value);
            allP2P.set(data.key, p2p);
        }
        p2p.initP2P();
        p2p.createVideoBox();
        p2p.startOffer();
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
