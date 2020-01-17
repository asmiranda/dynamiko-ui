class HrRequisitionUI {
    constructor() {
        var context = this;
        $(document).on('click', '.btnRemoveApplicant', function() {
            context.removeApplicant(this);
        });
        $(document).on('change', 'input.mainId[name="HrRequisitionId"]', function() {
            console.log("###############HrRequisitionId change#############");
            context.reArrange(this);
        });
    }

    removeApplicant(obj) {
        var context = this;
        var hrRequisitionId = $(obj).attr("requisitionId");
        var hrRequisitionApplicantId = $(obj).attr("hrRequisitionApplicantId");
        console.log("Remove Applicant for record ID === "+hrRequisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/removeApplicant/${hrRequisitionId}/${hrRequisitionApplicantId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            context.arrangeStages(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet(); 
    }

    moveApplicant(requisitionId, applicantId, applicationStatus) {
        var context = this;
        console.log("Rearrange for record ID === "+requisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/moveApplicant/${requisitionId}/${applicantId}/${applicationStatus}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            context.arrangeStages(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet(); 
    }

    reArrange(obj) {
        var context = this;
        var hrRequisitionId = $(obj).val();
        console.log("Rearrange for record ID === "+hrRequisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadApplicants/${hrRequisitionId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            context.arrangeStages(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet(); 
    }

    arrangeStages(data) {
        console.log(data);
        $(".newApplicant").empty();
        $(".interviewApplicant").empty();
        $(".offerApplicant").empty();
        $(data).each(function(index, obj) {
            var requisitionId = obj.getProp("hrRequisitionId");
            var hrRequisitionApplicantId = obj.getProp("hrRequisitionApplicantId");            
            var applicationStatus = obj.getProp("applicationStatus");
            var applicantId = obj.getProp("hrApplicantId");
            var applicant = obj.getProp("applicant");
            var email = obj.getProp("email");
            var contact = obj.getProp("contact");
            var applyDate = obj.getProp("applyDate");
            var companyCode = obj.getProp("companyCode");

            var specialization = obj.getProp("specialization");
            if (specialization == undefined) {
                specialization = "<sub>type specialization here...</sub>";
            }
            var nextScheduleDate = obj.getProp("nextScheduleDate");
            if (nextScheduleDate == undefined) {
                nextScheduleDate = "<sub>next schedule...</sub>";
            }
            var lookFor = obj.getProp("lookFor");
            if (lookFor == undefined) {
                lookFor = "<sub>employee here...</sub>";
            }
            var strHtml = `
                <div class="box" draggable="true" ondragstart="dragApplicant(event)" requisitionId="${requisitionId}" applicantId="${applicantId}">
                    <div class="box-header text-left toggle-box" style="padding-bottom: 0px;" target=".box${applicantId}">
                        <h3 class="box-title"><a href="#" class="formLinker" recordId="${applicantId}" linkModule="HrApplicantUI"><b>${applicant}</b></a></h3> 
                        <a href="#" class="pull-right btn-box-tool btnRemoveApplicant" module="HrRequisitionUI" requisitionId="${requisitionId}" hrRequisitionApplicantId="${hrRequisitionApplicantId}" title="Remove Applicant"><i class="fa fa-remove"></i></a>
                        <a href="#" class="pull-right btn-box-tool btnQuickAttachment" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Upload Resume"><i class="fa fa-paperclip"></i></a>
                        <a href="#" class="pull-right btn-box-tool btnQuickDownloader" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Download Resume"><i class="fa fa-download"></i></a>
                    </div>
                    <div class="box-body box${applicantId}" style="display:none;">
                        <div class="col-md-4" style="padding-left: 0px;">
                            <img class="profile-user-img img-responsive formLinker" linkModule="HrApplicantUI" recordId="${applicantId}" src="${MAIN_URL}/api/generic/${companyCode}/profilePic/HrApplicantUI/${applicantId}" requisitionId="${requisitionId}" applicantId="${applicantId}">
                        </div>
                        <div class="col-md-8 text-left" style="padding-left: 0px;">
                            <span class="info-box-text">${specialization}</span>
                            <span class="info-box-text">${email} - ${contact}</span>
                            <span class="info-box-text">Applied: <b>${applyDate}</b> - ${applicationStatus}</span>
                            <span class="info-box-text"><i class="fa fa-calendar"></i> Schedule : 
                                <b>
                                    <a href="#" class="btnQuickUpdater" updater="calendar" module="HrRequisitionApplicantUI" recordId="${hrRequisitionApplicantId}" fieldName="applyDate">${nextScheduleDate}</a>
                                </b>
                            </span>
                            <span class="info-box-text"><i class="fa fa-user"></i> Look For : 
                                <b>
                                    <a href="#" class="btnQuickUpdater" updater="autoComplete" autoComplete="EmployeeUI" module="HrRequisitionApplicantUI" recordId="${hrRequisitionApplicantId}" fieldName="lookFor">${lookFor}</a>
                                </b>
                            </span>
                        </div>
                    </div>
                </div>
            `;
            if (applicationStatus=="NEW") {
                $(".newApplicant").append(strHtml);
            }
            else if (applicationStatus=="INTERVIEW") {
                $(".interviewApplicant").append(strHtml);
            }
            else if (applicationStatus=="OFFER") {
                $(".offerApplicant").append(strHtml);
            }
        })
    }

    dragApplicant(ev) {
        ev.dataTransfer.setData("applicantId", $(ev.target).attr("applicantId"));
        ev.dataTransfer.setData("requisitionId", $(ev.target).attr("requisitionId"));
    }
    dropApplicant(obj, ev) {
        ev.preventDefault();
        var requisitionId = ev.dataTransfer.getData("requisitionId");
        var applicantId = ev.dataTransfer.getData("applicantId");
        var applicationStage = $(obj).attr("applicationStage");
        console.log("applicantId "+applicantId);
        console.log("requisitionId "+requisitionId);
        console.log("applicationStage "+applicationStage);

        this.moveApplicant(requisitionId, applicantId, applicationStage);
    }
    allowDrop(ev) {
        ev.preventDefault();
    }

}

$(function () {
    hrRequisitionUI = new HrRequisitionUI();
});

