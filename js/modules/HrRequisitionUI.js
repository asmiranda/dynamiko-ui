class HrRequisitionUI {
    constructor() {
        var context = this;
        $(document).on('click', '.btnRemoveApplicant', function() {
            context.removeApplicant(this);
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
            var nextScheduleDate = obj.getProp("nextScheduleDate");
            var lookFor = obj.getProp("lookFor");
            var strHtml = `
                <div class="box">
                    <div class="box-header text-left" style="padding-bottom: 0px;">
                        <h3 class="box-title"><a href="#" class="formLinker" recordId="${applicantId}" linkModule="HrApplicantUI"><b>${applicant}</b></a></h3> 
                        <a href="#" class="pull-right btn-box-tool btnRemoveApplicant" module="HrRequisitionUI" requisitionId="${requisitionId}" hrRequisitionApplicantId="${hrRequisitionApplicantId}"><i class="fa fa-remove"></i> Remove</a>
                    </div>
                    <div class="box-body">
                        <div class="col-md-4" style="padding-left: 0px;">
                            <img class="profile-user-img img-responsive formLinker" linkModule="HrApplicantUI" recordId="${applicantId}" src="${MAIN_URL}/api/generic/${companyCode}/profilePic/HrApplicantUI/${applicantId}" requisitionId="${requisitionId}" applicantId="${applicantId}">
                        </div>
                        <div class="col-md-8 text-left" style="padding-left: 0px;">
                            <span class="info-box-text">${specialization}</span>
                            <span class="info-box-text">${email} - ${contact}</span>
                            <span class="info-box-text">Applied: <b>${applyDate}</b> - ${applicationStatus}</span>
                            <span class="info-box-text"><a href="#" class="btnChangeApplicantSchedule" module="HrRequisitionUI" requisitionId="${requisitionId}" hrRequisitionApplicantId="${hrRequisitionApplicantId}"><i class="fa fa-calendar"></i> Schedule</a> : <b>${nextScheduleDate}</b></span>
                            <span class="info-box-text"><a href="#" class="btnChangeApplicantSchedule" module="HrRequisitionUI" requisitionId="${requisitionId}" hrRequisitionApplicantId="${hrRequisitionApplicantId}"><i class="fa fa-user"></i> Look For</a> : <b>${lookFor}</b></span>
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
}
