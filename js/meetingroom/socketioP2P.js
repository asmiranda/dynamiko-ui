class SocketIOP2P {
    constructor() {
        this.peerConnections = [];
    }

    sendOffer(mySocket, data) {
        let toEmail = data["fromEmail"];
        let myP2P = new MyP2P(toEmail);
        this.peerConnections[toEmail] = myP2P;

        myP2P.peerConnection.createOffer(function (sdp) {
            console.log(`sendOffer to ${toEmail}`)
            myP2P.peerConnection.setLocalDescription(sdp);
            mySocket.emit("offer", { "fromEmail": storage.getUname(), "toEmail": toEmail, "sdp": sdp });
        }, function (error) {
            console.log("sendOffer", error)
        });
    }

    onOffer(mySocket, data) {
        let toEmail = data["fromEmail"];
        let myP2P = new MyP2P(toEmail);
        this.peerConnections[toEmail] = myP2P;

        let pAnswer = null;
        myP2P.peerConnection.setRemoteDescription(new RTCSessionDescription(data["sdp"]));
        myP2P.peerConnection.createAnswer().then(function (answer) {
            pAnswer = answer;
            return myP2P.peerConnection.setLocalDescription(answer);
        })
            .then(function () {
                console.log(`onOffer to ${toEmail}`)
                mySocket.emit("answer", { "fromEmail": storage.getUname(), "toEmail": toEmail, "room": data["room"], "sdp": pAnswer });
            })
            .catch(e => console.log(e));
    }

    onAnswer(mySocket, data) {
        let toEmail = data["fromEmail"];
        let myP2P = this.peerConnections[toEmail]
        console.log(`onAnswer with ${toEmail}`)
        myP2P.peerConnection.setRemoteDescription(new RTCSessionDescription(data["sdp"]));
    }

    onIce(mySocket, data) {
        let toEmail = data["fromEmail"];
        let myP2P = this.peerConnections[toEmail]
        console.log(`onIce from ${toEmail}`)
        myP2P.peerConnection.addIceCandidate(new RTCIceCandidate(data["sdp"]));
    }
}

class MyP2P {
    constructor(email) {
        this.email = email;
        this.peerConnectionConfig = {
            'iceServers': [
                { 'urls': 'stun:stun.services.mozilla.com' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        };
        this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig, {
            optional: [{
                RtpDataChannels: true
            }]
        });
        this.initVideoBox();

        this.peerConnection.onicecandidate = this.iceCallback;
    }

    initVideoBox() {
        var context = this;
        if (!$(`.miniVideo[email="${context.email}"]`).length) {
            let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/PersonUI/getProfileFromEmail/${context.email}`;
            let ajaxRequestDTO = new AjaxRequestDTO(url, "");

            let successFunction = function (data) {
                let profile = data.getProp("firstName");
                let str = `
                    <div style="flex: 1; width: 100px; display: flex; flex-direction: column; margin-bottom: 10px;" class="miniVideo" email="${context.email}">
                        <video class="miniVideoStream" email="${context.email}" style="width: 100px; max-height: 100px; background-color: cornflowerblue;" autoplay playsinline></video>
                        <div class="text-center" style="width: 100px; color:white;">${profile}</div>
                    </div>
                `;
                $(".videoBoxList").append(str);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    iceCallback() {

    }
}
