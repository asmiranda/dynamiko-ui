class MeetingRoom {
    constructor() {
        this.peerConnection;
        this.dataChannel;
        this.input = document.getElementById("messageInput");
        this.sockjs = new SockJS(`${MAIN_URL}/socket`);
        // this.sockjs = new WebSocket(`ws://localhost:8888/socket`);

        var context = this;
        context.sockjs.onopen = function() {
            console.log("Connected to the signaling server");
            context.initialize();
        };
        context.sockjs.onclose = function() {
            console.log('close');
        };
        context.sockjs.onmessage = function(msg) {
            console.log("Got message", msg.data);
            var content = JSON.parse(msg.data);
            var data = content.data;
            switch (content.event) {
            // when somebody wants to call us
            case "offer":
                context.handleOffer(data);
                break;
            case "answer":
                context.handleAnswer(data);
                break;
            // when a remote peer sends an ice candidate to us
            case "candidate":
                context.handleCandidate(data);
                break;
            default:
                break;
            }
        };
    
        $(document).on('click', `.btnCall`, function () {
            context.call();
        });
        $(document).on('click', `.btnSendChat`, function () {
            context.sendMessage();
        });        
    }

    send(message) {
        this.sockjs.send(JSON.stringify(message));
    }

    initialize() {
        console.log("Init RTCPeer 1");
        var configuration = null;
        var context = this;
    
        context.peerConnection = new RTCPeerConnection(configuration, {
            optional : [ {
                RtpDataChannels : true
            } ]
        });
    
        // Setup ice handling
        context.peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                context.send({
                    event : "candidate",
                    data : event.candidate
                });
            }
        };
    
        // creating data channel
        console.log("Create Data Channel");
        context.dataChannel = context.peerConnection.createDataChannel("dataChannel", {
            reliable : true
        });
    
        context.dataChannel.onerror = function(error) {
            console.log("Error occured on datachannel:", error);
        };
    
        // when we receive a message from the other peer, printing it on the console
        context.dataChannel.onmessage = function(event) {
            console.log("message:", event.data);
            var value = $("textarea#allChatMessages").val();
            value += event.data;
            $("textarea#allChatMessages").val(value);
        };
    
        context.dataChannel.onclose = function() {
            console.log("data channel is closed");
        };
    }
    
    call() {
        var context = this;
        context.peerConnection.createOffer(function(offer) {
            context.send({
                event : "offer",
                data : offer
            });
            context.peerConnection.setLocalDescription(offer);
        }, function(error) {
            alert("Error creating an offer");
        });
    }
    
    handleOffer(offer) {
        var context = this;
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    
        // create and send an answer to an offer
        context.peerConnection.createAnswer(function(answer) {
            context.peerConnection.setLocalDescription(answer);
            context.send({
                event : "answer",
                data : answer
            });
        }, function(error) {
            alert("Error creating an answer");
        });
    
    };
    
    handleCandidate(candidate) {
        var context = this;
        context.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
    
    handleAnswer(answer) {
        var context = this;
        context.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("connection established successfully!!");
    };
    
    sendMessage() {
        var context = this;
        var messageText = $('textarea#chatMessageTxt').val();
        context.dataChannel.send(messageText);
        $('textarea#chatMessageTxt').val("");
    }

    join(roomName) {
        this.roomName = roomName;
        console.log(`Joining Room ${roomName}`);
        var context = this;

        var successRoomPopup = function (data) {
        }
        var successCallback = function (data) {
            showModalAny1200.show(`Joining Room ${roomName}`, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }
}

$(function () {
    meetingRoom = new MeetingRoom();
});

