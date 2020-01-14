class HrRequisitionUI {
    constructor() {
    }

    reArrange(obj) {
        var context = this;
        var hrRequisitionId = $(obj).val();
        console.log("Rearrange for record ID === "+hrRequisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadApplicants/${hrRequisitionId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".newApplicant").empty();
            $(".interviewApplicant").empty();
            $(".offerApplicant").empty();
            $(data).each(function(index, obj) {
                var applicationStatus = obj.getProp("applicationStatus");
                var applicantId = obj.getProp("hrApplicantId");
                var applicant = obj.getProp("applicant");
                var email = obj.getProp("email");
                var contact = obj.getProp("contact");
                var applyDate = obj.getProp("applyDate");
                var companyCode = obj.getProp("companyCode");
                var strHtml = `
                    <li class="list-group-item">
                        <div class="row" style="margin: 2px; border-radius: 10px 10px 5px 5px;background:#f5f6f7;">
                            <div class="col-md-4">
                                <img class="profile-user-img img-responsive img-circle" src="${MAIN_URL}/api/generic/${companyCode}/profilePic/HrApplicantUI/${applicantId}">
                            </div>
                            <div class="col-md-8 text-left" style="margin-top: 5px;">
                                <span class="info-box-number"><a href="#" class="formLinker" recordId="${applicantId}" linkModule="HrApplicantUI">${applicant}</a></span>
                                <span class="info-box-text">${email} - ${contact}</span>
                                <span class="info-box-text">Applied: <b>${applyDate}</b> - ${applicationStatus}</span>
                            </div>
                        </div>
                    </li>
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
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet(); 
    }
}
