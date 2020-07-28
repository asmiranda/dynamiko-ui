class MeetingLoader {
    constructor() {
        var context = this;
        $(document).on('click', `.btnChooseMeetingRoom`, function () {
            console.log("Loading Meeting Room.");
            context.displayMeeting(this);
        });
    }

    loadMeetings() {
        var url = `${MAIN_SIGNAL_HTTP_URL}/api/signal/${localStorage.companyCode}/getRooms`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function (data) {
            console.log("loadMeetings", url, data);
            context.arrangeMeetingRecords(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeMeetingRecords(data) {
        var context = this;
        var divSelector = `#myMeetings`;
        $(divSelector).empty();
        $(data).each(function (index, obj) {
            var label = obj.getProp("confName");
            var code = obj.getProp("confCode");
            var str = `<li><a href="#" class="btnChooseMeetingRoom" conCompany="${localStorage.companyCode}" conRoom="${code}" name="${label}">${label}</a></li>`;
            $(divSelector).append(str);
        });
    }

    displayMeeting(obj) {
        var roomName = $(obj).attr("name");
        var conCompany = $(obj).attr("conCompany");
        var conRoom = $(obj).attr("conRoom");
        $("#roomNameDisplay").html(roomName);
        meetingRoom.join(roomName, conCompany, conRoom);
    }
}

$(function () {
    meetingLoader = new MeetingLoader();
});
