class ConferenceUI extends AbstractUI { 
    constructor() {
        super("ConferenceUI");
        var context = this;

        this.peerConnection;
        this.dataChannel;

        this.conn = new WebSocket('ws://localhost:8888/socket');
        this.conn.onopen = function() {
            console.log("Connected to the signaling server");
            context.initialize();
        };

        context.conn.onmessage = function(msg) {
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
    }

    changeModule(evt) {
        // accountChartUI.loadTopRecords("AccountChart");
    }

    //connecting to our signaling server 

    send(message) {
        var context = this;
        context.conn.send(JSON.stringify(message));
    }

    initialize() {
        var context = this;
        var configuration = null;

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
        context.dataChannel = context.peerConnection.createDataChannel("dataChannel", {
            reliable : true
        });

        context.dataChannel.onerror = function(error) {
            console.log("Error occured on datachannel:", error);
        };

        // when we receive a message from the other peer, printing it on the console
        context.dataChannel.onmessage = function(event) {
            console.log("message:", event.data);
        };

        context.dataChannel.onclose = function() {
            console.log("data channel is closed");
        };
    }

    createOffer() {
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
        var value = $("#messageInput").val();
        context.dataChannel.send(value);
        $("#messageInput").val("");
    }
}

$(function () {
    conferenceUI = new ConferenceUI();
});

