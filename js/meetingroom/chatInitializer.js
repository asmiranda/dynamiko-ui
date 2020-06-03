class ChatInitializer {
    init(roomName, localStream, localVideo, remoteVideo) {
        //get all connected users in this room, then  iterate to create P2P
        this.roomName = roomName;
        this.localStream = localStream;
        this.localVideo = localVideo;
        this.p2p = new P2P(roomName, "P1", "P2", localStream, localVideo, remoteVideo);
    }

    offer() {
        var context = this;

        this.p2p.offer();
    }
      
}

$(function () {
    chatInitializer = new ChatInitializer();
});


