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
        else if ("active-users"==action) {
            meetingRoom.activeUsers(from, data);
        }
    }

    activeUsers(from, data) {
        console.log(data);
        $(".selectChatTo").empty();
        $(".selectChatTo").append(`<option value="All">All</option>`);
        $(data).each(function(index, str) {
            var opt = `<option value="${str.key}">${str.value}</option>`;
            $(".selectChatTo").append(opt);
        });
    }

    userJoined(from, data) {
        var context = this;
        var newlyJoinedProfile = "";
        console.log(data);
        $(".selectChatTo").empty();
        $(".selectChatTo").append(`<option value="All">All</option>`);
        $(data).each(function(index, str) {
            var opt = `<option value="${str.key}">${str.value}</option>`;
            $(".selectChatTo").append(opt);
            if (str.key==from) {
                newlyJoinedProfile =str.value;
            }
            context.updateVideoBox(str);
        });
        if (newlyJoinedProfile!="") {
            $("#messageAlert").html(newlyJoinedProfile+" joined!");
        }
    }

    updateVideoBox(keyVal) {
        var email = keyVal.key;
        var profile = keyVal.value;
        if (!$(`.miniVideo[email="${email}"]`).length) {
            var str = `
                <div style="flex: 1; width: 100px; display: flex; flex-direction: column;" class="miniVideo" email="${email}">
                    <video class="miniVideoStream" email="${email}" style="width: 100px; min-height: 100px; max-height: 100px; background-color: cornflowerblue;" autoplay playsinline></video>
                    <div class="text-center">${profile}</div>
                </div>
            `;
            $(".videoBoxList").append(str);
        }
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
        }
        var successCallback = function (data) {
            showModalAny1200.show(title, data, successRoomPopup);
        };
        utils.getTabHtml("ConferenceUI", "MeetingRoom", successCallback);
    }
}

$(function () {
    meetingRoom = new MeetingRoom();
});
