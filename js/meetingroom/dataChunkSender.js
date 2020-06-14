class DataChunkSender {
    sendToDataChannel(dataChannel, action, str) {
        dataChannel.send(action);
        dataChannel.send(str);
    }

    sendToSocket(roomSignal, chunkSize, action, sendTo, str) {
        // var chunkSize = 1000;
        var arrChunks = this.splitString(str, chunkSize);

        roomSignal.send(action+"-multipart-start", sendTo, '');
        for (var offset=0; offset<arrChunks.length; offset++) {
            var chunk = arrChunks[offset];
            roomSignal.send(action+"-multipart-buffer", sendTo, chunk);
        }
        roomSignal.send(action+"-multipart-end", sendTo, '');
    }

    splitString(string, size) {
        var re = new RegExp('.{1,' + size + '}', 'g');
        return string.match(re);
    }
}

$(function () {
    dataChunkSender = new DataChunkSender();
});
