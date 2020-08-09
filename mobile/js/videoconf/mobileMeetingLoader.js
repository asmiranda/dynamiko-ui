class MobileMeetingLoader {
    constructor() {
        var context = this;
        $(document).on('click', `.btnChooseMeetingRoom`, function () {
            console.log("Loading Meeting Room.");
            context.displayMeeting(this);
        });
    }

    loadMeetings() {
        var url = `${MAIN_SIGNAL_HTTP_URL}/api/signal/${mobileStorage.companyCode}/getRooms`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function (data) {
            console.log("loadMeetings", url, data);
            context.arrangeMeetingRecords(data);
        };
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeMeetingRecords(data) {
        var context = this;
        var divSelector = `#myMeetings`;
        $(divSelector).empty();
        $(data).each(function (index, obj) {
            var label = obj.getProp("confName");
            var code = obj.getProp("confCode");
            var str = `<li><a href="#" class="btnChooseMeetingRoom" conCompany="${mobileStorage.companyCode}" conRoom="${code}" name="${label}">${label}</a></li>`;
            $(divSelector).append(str);
        });
    }

    displayMeeting(obj) {
        var roomName = $(obj).attr("name");
        var conCompany = $(obj).attr("conCompany");
        var conRoom = $(obj).attr("conRoom");
        mobileSocketIOMeetingRoom.join("Join Room", conRoom);
    }
}

$(function () {
    mobileMeetingLoader = new MobileMeetingLoader();
});
