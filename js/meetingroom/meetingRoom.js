class MeetingRoom {
    constructor() {
    }

    messageCallback(msg) {
        var context = this;
        console.log("Got message", msg.data);
        var jsonMsg = JSON.parse(msg.data);

        var action = jsonMsg.action;
        var from = jsonMsg.from;
        var data = jsonMsg.data;

        if ("user-joined"==action) {
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
    }

    startOffering(from, data) {
        var context = this;
        console.log(data);
        $(data).each(function(index, str) {
            if  (str.key!=USERNAME) {
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
                var opt = `<option value="${str.key}" disabled>${str.value}</option>`;
                $(".selectChatTo").append(opt);
            }
            else {
                var opt = `<option value="${str.key}">${str.value}</option>`;
                $(".selectChatTo").append(opt);
            }
            if  (str.key!=USERNAME) {
                var p2pCreated = allP2P.has(str.key);
                if (!p2pCreated) {
                    var p2p = new P2P(str.key, str.value);
                    p2p.initP2P();
                    allP2P.set(str.key, p2p);
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
            roomSignal.joinRoom(conCompany, conRoom, context.messageCallback);
            audioVideoStream.initialize();
            context.shareVideo();
        }
        var successCallback = function (data) {
            showModalAny1200.show(title, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }

    unshareVideo() {
        var context = this;

        const myVideo = document.querySelector('video#myVideo');
        myVideo.srcObject = null;

        for (const myP2P of allP2P) {
            myP2P.peerConnection.removeStream(context.localStream);  
        }
    }

    shareVideo() {
        var context = this;

        const myVideo = document.querySelector('video#myVideo');
        myVideo.srcObject = context.localStream;

        for (const myP2P of allP2P) {
            myP2P.peerConnection.addStream(context.localStream);  
        }
    }
}

$(function () {
    allP2P = new Map();
    meetingRoom = new MeetingRoom();
});
