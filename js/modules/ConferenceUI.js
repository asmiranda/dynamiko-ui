class ConferenceUI extends AbstractUI { 
    constructor() {
        super("ConferenceUI");
        this.conn = new WebSocket('ws://localhost:8080/socket');
        this.conn.onopen = function() {
            console.log("Connected to the signaling server");
            initialize();
        };

        this.peerConnection;
        this.dataChannel;
        this.input = document.getElementById("messageInput");
    
        
        var context = this;
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
                send({
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
            send({
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
            send({
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
        context.dataChannel.send(input.value);
        context.input.value = "";
    }
}

$(function () {
    conferenceUI = new ConferenceUI();
});

