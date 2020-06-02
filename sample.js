//connecting to our signaling server 
var conn = new WebSocket('ws://localhost:8888/socket');
var localStream;
const videoConstraints = window.constraints = {
    audio: false,
    video: true
};

conn.onopen = function () {
    appendActivity("conn.onopen", "Connected to the signaling server", "");
    initialize();
};

conn.onmessage = function (msg) {
    var content = JSON.parse(msg.data);
    var data = content.data;
    appendActivity("conn.onmessage", "Got message", content.event);
    switch (content.event) {
        // when somebody wants to call us
        case "offer":
            handleOffer(data);
            break;
        case "answer":
            handleAnswer(data);
            break;
        // when a remote peer sends an ice candidate to us
        case "candidate":
            handleCandidate(data);
            break;
        default:
            break;
    }
};

function send(message) {
    conn.send(JSON.stringify(message));
}

var peerConnection;
var dataChannel;
var input = document.getElementById("messageInput");

async function initialize() {
    var configuration = null;

    try {
        localStream = await navigator.mediaDevices.getUserMedia(videoConstraints);
        displayLocalStream(localStream);
    } catch (e) {
        appendActivity("ERROR in Stream", "", e);
    }
    
    peerConnection = new RTCPeerConnection(configuration, {
        optional: [{
            RtpDataChannels: true
        }]
    });

    peerConnection.addStream(localStream);

    peerConnection.onaddstream = function(event) {
        displayRemoteStream(event);
    };

    // Setup ice handling
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            send({
                event: "candidate",
                data: event.candidate
            });
        }
    };

    // creating data channel
    dataChannel = peerConnection.createDataChannel("dataChannel", {
        reliable: true
    });

    dataChannel.onerror = function (error) {
        appendActivity("dataChannel.onerror", "#########Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function (event) {
        appendActivity("dataChannel.onmessage", "message:", event.data);
    };

    dataChannel.onclose = function () {
        appendActivity("dataChannel.onclose", "data channel is closed", "");
    };
}

function displayLocalStream() {
    const video = document.querySelector('#localVideo');
    const videoTracks = localStream.getVideoTracks();
    appendActivity("displayLocalStream", "Got stream with constraints:", "");
    video.srcObject = localStream;
}

function displayRemoteStream(event) {
    const video = document.querySelector('#remoteVideo');
    appendActivity("displayRemoteStream", "Got remote stream:", "");
    video.srcObject = event.stream;
}

function createOffer() {
    peerConnection.createOffer(function (offer) {
        send({
            event: "offer",
            data: offer
        });
        peerConnection.setLocalDescription(offer);
    }, function (error) {
        appendActivity("createOffer", "#########Error creating an offer", offer);
    });
}

function handleOffer(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function (answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event: "answer",
            data: answer
        });
    }, function (error) {
        appendActivity("handleOffer", "#########Error creating an answer", offer);
    });

};

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    appendActivity("handleAnswer", "connection established successfully!!", answer);
};

function sendMessage() {
    dataChannel.send(input.value);
    input.value = "";
}

function clearActivity() {
    $(`#activity`).empty();
}

function appendActivity(funcName, message, obj) {
    $(`#activity`).append("<br>");
    $(`#activity`).append(funcName + " - " + message + " - " +obj);
}