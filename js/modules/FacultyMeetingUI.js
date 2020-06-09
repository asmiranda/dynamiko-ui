class FacultyMeetingUI extends AbstractUI { 
    constructor() {
        super("FacultyMeetingUI");
        var context = this;

        $(document).on('click', `.btnChooseMeetingRoom`, function() {
            context.chooseMeetingRoom(this);
        });
    }

    chooseMeetingRoom(obj) {
        var roomName = $(obj).attr("name");
        var conCompany = $(obj).attr("conCompany");
        var conRoom = $(obj).attr("conRoom");
        $("#roomNameDisplay").html(roomName);
        meetingRoom.joinNoPopup(roomName, conCompany, conRoom);
    }

    loadMeetings(moduleName) {
        utils.showSpin();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${moduleName}/getMeetings`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function(data) {
            console.log("loadMeetings", url, data);
            context.arrangeMeetingRecords(data, moduleName);
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeMeetingRecords(data, moduleName) {
        var context = this;
        var divSelector = `#myMeetings`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var conCompany = obj.getProp("conCompany");
            var conRoom = obj.getProp("conRoom");
            var name = obj.getProp("name");
            var str = `<li><a href="#" class="btnChooseMeetingRoom" conCompany="${conCompany}" conRoom="${conRoom}" module="${moduleName}" name="${name}">${name}</a></li>`;
            $(divSelector).append(str);
        });        
    }

    changeModule(evt) {
        facultyMeetingUI.loadMeetings('FacultyMeetingUI');
    }
}

$(function () {
    facultyMeetingUI = new FacultyMeetingUI();
});

