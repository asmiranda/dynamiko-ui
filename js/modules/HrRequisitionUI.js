class HrRequisitionUI { 
    changeMainId(obj) {
        utils.loadRecordToForm(obj, hrRequisitionUI);
        hrRequisitionUI.reArrange(obj);
        hrRequisitionUI.loadFulfilled(obj);
    }

    doMainSearchData(evt) {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/quickMainSearcher/${localStorage.filterText}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".quickMainSearcherResult").empty();
            $(data).each(function(index, obj) {
                var title = obj.getPropDefault("title", "Title Not Specified");
                var recruiter = obj.getPropDefault("recruiter", "Recruiter not chosen");
                var manager = obj.getPropDefault("manager", "Manager not chosen");
                var numberOfFulfilled = obj.getPropDefault("numberOfFulfilled", "0");
                var numberOfOpening = obj.getPropDefault("numberOfOpening");
                var hrRequisitionId = obj.getPropDefault("hrRequisitionId");
                var status = "";
                if (numberOfFulfilled == numberOfOpening) {
                    status = "Completed"
                }
                else {
                    status = `${numberOfFulfilled} completed of requested ${numberOfOpening}`;
                }
                var str = `
                    <a href="#" class="loadRecordToForm" module="HrRequisitionUI" recordid="${hrRequisitionId}" style="font-weight: bold;">${title}</a>
                    <p class="text-muted">
                        Recruiter: ${recruiter}<br/>
                        Manager: ${manager}<br/>
                        Status: ${status}
                    </p>
                    <hr>
                `
                $(".quickMainSearcherResult").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    changeModule(evt) {
        employeeUI.init();

        hrRequisitionUI.loadTodoList();
        hrRequisitionUI.loadStages();
        hrRequisitionUI.loadForInterview();
        hrRequisitionUI.loadForOffer();

        hrRequisitionUI.loadTeamRequisition();
        hrRequisitionUI.loadOpenRequisition();
        hrRequisitionUI.loadRecruitmentPerformanceChart();
        hrRequisitionUI.loadMyAssignedRequisition();
    }


    init() { 
        $("#dynamikoMainSearch").hide();
    }

    gotoApplicantProfile(obj) {
        console.log("Called gotoApplicantProfile");
        var recordId = $(obj).attr("recordId");
        console.log("RecordId == "+recordId);
    }
    gotoRecruiterProfile(obj) {
        console.log("Called gotoRecruiterProfile");
        var recordId = $(obj).attr("recordId");
        console.log("RecordId == "+recordId);
    }
    gotoJobListing(obj) {
        console.log("Called gotoJobListing");
        var recordId = $(obj).attr("recordId");
        console.log("RecordId == "+recordId);
    }
    gotoManagerProfile(obj) {
        console.log("Called gotoManagerProfile");
        var recordId = $(obj).attr("recordId");
        console.log("RecordId == "+recordId);
    }

    loadForInterview() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/getForInterview`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);

            $(".HrRequisitionUI_InterviewScheduleList").empty();
            $(data).each(function(index, obj) {
                var applicantName = obj.getProp("applicantName");
                var recruiterName = obj.getProp("recruiterName");
                var managerName = obj.getProp("managerName");
                var interviewDate = obj.getProp("interviewDate");
                var requisitionTitle = obj.getProp("requisitionTitle");
                var hrApplicantId = obj.getProp("hrApplicantId");
                var recruiterId = obj.getProp("recruiterId");
                var managerId = obj.getProp("managerId");
                var hrRequisitionId = obj.getProp("hrRequisitionId");
                var hrRequisitionApplicantInterviewId = obj.getProp("hrRequisitionApplicantInterviewId");
                var str = `
                    <div style="display: flex;">
                        <div class="text-center" style="flex: 10%">
                            <img class="img-circle img-bordered-sm profilePic" name="profilePic" module="HrApplicantUI" src="${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/HrApplicantUI/${hrApplicantId}" alt="user image" style="width: 40px; height: 40px;"/>
                        </div>
                        <div style="flex: 50%">
                            <a href="#" class="HrRequisitionUI_btnGotoApplicantProfile" recordId="${hrApplicantId}">${applicantName}</a></span> look for 
                            <span><a href="#" class="HrRequisitionUI_btnGotoRecruiterProfile" recordId="${recruiterId}">${recruiterName}</a>
                            <p class="text-muted">
                                <span><a href="#" class="HrRequisitionUI_btnGotoJobListing" recordId="${hrRequisitionId}">${requisitionTitle}</a></span> for 
                                <span><a href="#" class="HrRequisitionUI_btnGotoManagerProfile" recordId="${managerId}">${managerName}</a></span>
                            </p>
                        </div>
                        <div style="flex: 40%">
                            <small class="text-muted pull-right"><i class="fa fa-clock-o"></i> 
                                <span>
                                    <a href="#" class="quickUpdaterTarget" updater="calendar" module="HrRequisitionUI" recordId="${hrRequisitionApplicantInterviewId}" fieldName="interviewDate">${interviewDate}</a>
                                </span>
                            </small>
                        </div>
                    </div>
                    <hr style="margin-top: 5px; width: 98%">
                `;
                $(".HrRequisitionUI_InterviewScheduleList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadForOffer() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/getForOffer`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);

            $(data).each(function(index, obj) {
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadStages() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/getRecruitmentStages`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            $(".HrRequisitionUI_CandidateCount").html("0");
            $(".HrRequisitionUI_OpenJobsCount").html("0");
            $(".HrRequisitionUI_ScheduleThisWeek").html("0");

            $(".HrRequisitionUI_TotalNewApplication").html("0");
            $(".HrRequisitionUI_TotalForInterview").html("0");
            $(".HrRequisitionUI_TotalForOffer").html("0");
            $(".HrRequisitionUI_TotalFulfilled").html("0");

            $(data).each(function(index, obj) {
                var key = obj.getProp("key");
                var value = obj.getProp("value");
                if (key=="INTERVIEW") {
                    $(".HrRequisitionUI_TotalForInterview").html(value);
                }
                else if (key=="OFFER") {
                    $(".HrRequisitionUI_TotalForOffer").html(value);
                }
                else if (key=="NEW") {
                    $(".HrRequisitionUI_TotalNewApplication").html(value);
                }
                else if (key=="FULFILLED") {
                    $(".HrRequisitionUI_TotalFulfilled").html(value);
                }
                else if (key=="APPLICANT_COUNT") {
                    $(".HrRequisitionUI_CandidateCount").html(value);
                }
                else if (key=="OPEN_JOBS") {
                    $(".HrRequisitionUI_OpenJobsCount").html(value);
                }
                else if (key=="SCHEDULE_THIS_WEEK") {
                    $(".HrRequisitionUI_ScheduleThisWeek").html(value);
                }
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    showAddTask(obj) {
        $(`input[name="HrRequisitionUI_TaskId"]`).val("");
        $(`input[name="HrRequisitionUI_TaskName"]`).val("");
        $(`input[name="HrRequisitionUI_TaskDate"]`).val("");
    }

    showUpdateTask(obj) {
        var recordId = $(obj).attr("recordId");
        var taskName = $(`.HrRequisitionUI_Task[recordId="${recordId}"][name="taskName"]`).html();
        var taskDate = $(`.HrRequisitionUI_Task[recordId="${recordId}"][name="taskDate"]`).attr("value");
        $(`input[name="HrRequisitionUI_TaskId"]`).val(recordId);
        $(`input[name="HrRequisitionUI_TaskName"]`).val(taskName);
        $(`input[name="HrRequisitionUI_TaskDate"]`).val(taskDate);
    }

    deleteTask(obj) {
        var taskId = $(obj).attr("recordId");

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/deleteTask/${taskId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            hrRequisitionUI.arrangeTodoList(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    saveTask(obj, nextAction) {
        var taskId = $(`input[name="HrRequisitionUI_TaskId"]`).val();
        var taskName = $(`input[name="HrRequisitionUI_TaskName"]`).val();
        var taskDate = $(`input[name="HrRequisitionUI_TaskDate"]`).val();

        var tmp = {};
        tmp["taskId"] = taskId;
        tmp["name"] = taskName;
        tmp["taskDate"] = taskDate;
        
        var vdata = JSON.stringify(tmp);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/post/saveTask`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);

        var successFunction = function(data) {
            console.log(data);
            hrRequisitionUI.arrangeTodoList(data);
            if (nextAction=="CLOSE") {
                $('#HrRequisitionUI_TaskDialog').modal('toggle');
            }
            else {
                $(`input[name="HrRequisitionUI_TaskName"]`).val("");
                $(`input[name="HrRequisitionUI_TaskDate"]`).val("")
            }
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successFunction);
    }

    loadTodoList() {
        console.log("loadTodoList");

        var ajaxRequestDTO = new AjaxRequestDTO();
        ajaxRequestDTO.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadTodoList`;
        ajaxRequestDTO.data = "";

        var successFunction = function(data) {
            console.log(data);
            hrRequisitionUI.arrangeTodoList(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeTodoList(data) {
        $(".divToDoList").empty();
        $(data).each(function(index, obj) {
            var personTaskId = obj.getProp("personTaskId");
            var taskDate = obj.getProp("taskDate");            
            var taskName = obj.getProp("name");

            var strHtml = `
                <li>
                    <span class="text HrRequisitionUI_Task" recordId="${personTaskId}" name="taskName">${taskName}</span>
                    <small class="label label-info HrRequisitionUI_Task" recordId="${personTaskId}" name="taskDate" value="${taskDate}"><i class="fa fa-clock-o"></i> ${taskDate}</small>
                    <div class="tools">
                        <i class="fa fa-edit HrRequisitionUI_btnShowUpdateTask" recordId="${personTaskId}" module="HrRequisitionUI" data-toggle="modal" data-target="#HrRequisitionUI_TaskDialog"></i>
                        <i class="fa fa-trash-o HrRequisitionUI_btnDeleteTask" recordId="${personTaskId}" module="HrRequisitionUI"></i>
                    </div>
                </li>
            `;
            $(".divToDoList").append(strHtml);
        })
    }

    createJob(obj) {
        var title = $("input[name='createJobRequisitionTitle']").val();
        var recruiterCode = $(".HiddenAutoComplete[name='createJobRecruiterCode']").val();
        var managerCode = $(".HiddenAutoComplete[name='createJobManagerCode']").val();
        var numberOfOpening = $("input[name='createJobNumberOfOpening']").val();

        var tmp = {};
        tmp["title"] = title;
        tmp["recruiterCode"] = recruiterCode;
        tmp["managerCode"] = managerCode;
        tmp["numberOfOpening"] = numberOfOpening;
        
        var vdata = JSON.stringify(tmp);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/post/createJob`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            hrRequisitionUI.loadTeamRequisition();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    removeApplicant(obj) {
        var hrRequisitionId = $(obj).attr("requisitionId");
        var hrRequisitionApplicantId = $(obj).attr("hrRequisitionApplicantId");
        console.log("Remove Applicant for record ID === "+hrRequisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/removeApplicant/${hrRequisitionId}/${hrRequisitionApplicantId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            hrRequisitionUI.arrangeStages(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    moveApplicant(requisitionId, applicantId, applicationStatus) {
        console.log("Rearrange for record ID === "+requisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/moveApplicant/${requisitionId}/${applicantId}/${applicationStatus}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            hrRequisitionUI.arrangeStages(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    reArrange(obj) {
        var hrRequisitionId = $(obj).val();
        console.log("Rearrange for record ID === "+hrRequisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadApplicants/${hrRequisitionId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            hrRequisitionUI.arrangeStages(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
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
                nextScheduleDate = " Schedule";
            }
            var lookFor = obj.getProp("lookFor");
            if (lookFor == undefined) {
                lookFor = "<sub>employee here...</sub>";
            }

            var strAccept = "";
            var strRemove = "";
            var strUpload = "";
            var strDownload = "";
            if (applicationStatus=="NEW") {
                strRemove = `<a href="#" class="btn btn-box-tool btnRemoveApplicant" module="HrRequisitionUI" requisitionId="${requisitionId}" hrRequisitionApplicantId="${hrRequisitionApplicantId}" title="Remove Applicant"><i class="fa fa-remove"></i> Remove</a>`;
                strUpload = `<a href="#" class="btn btn-box-tool quickAttachmentTarget" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Upload Resume"><i class="fa fa-paperclip"> </i> </a>`;
                strDownload = `<a href="#" class="btn btn-box-tool quickDownloaderTarget" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Download Resume"><i class="fa fa-download"> </i> </a>`;
            }
            else if (applicationStatus=="INTERVIEW") {
                strRemove = `<a href="#" class="btn btn-box-tool btnRemoveApplicant" module="HrRequisitionUI" requisitionId="${requisitionId}" hrRequisitionApplicantId="${hrRequisitionApplicantId}" title="Remove Applicant"><i class="fa fa-remove"></i> Remove</a>`;
                strUpload = `<a href="#" class="btn btn-box-tool quickAttachmentTarget" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Upload Resume"><i class="fa fa-paperclip"> </i> </a>`;
                strDownload = `<a href="#" class="btn btn-box-tool quickDownloaderTarget" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Download Resume"><i class="fa fa-download"> </i> </a>`;
            }
            else if (applicationStatus=="OFFER") {
                strAccept = `<a href="#" class="btn btn-box-tool btnAcceptApplicant" module="HrRequisitionApplicantUI" recordId="${hrRequisitionApplicantId}" title="Accept Applicant"><i class="fa fa-thumbs-o-up"></i> Accept</a>`;
            }

            var strHtml = `
                <div class="box" draggable="true" ondragstart="hrRequisitionUI.dragApplicant(event)" requisitionId="${requisitionId}" applicantId="${applicantId}">
                    <div class="box-header text-left toggle-box" style="padding-bottom: 0px;" toggleTarget=".box${applicantId}">
                        <div>
                            <div class="box-title">
                                <h3 class="box-title">
                                    <a href="#" class="formLinker" recordId="${applicantId}" linkModule="HrApplicantUI">${applicant}</a>
                                </h3><br/>
                                <h4 class="box-title">
                                    <a href="#" class="quickUpdaterTarget" updater="text" module="HrApplicantUI" recordId="${applicantId}" fieldName="specialization">${specialization}</a>
                                </h4><br/>
                                <a href="#" style="padding-left: 0px;" class="btn btn-box-tool quickUpdaterTarget" updater="calendar" module="HrRequisitionApplicantUI" recordId="${hrRequisitionApplicantId}" fieldName="applyDate"><i class="fa fa-calendar"></i> ${nextScheduleDate}</a>
                            </div>
                            <div class="box-tools pull-right">
                                <img class="img-responsive formLinker img-circle img-bordered-sm profilePic" style="height:57px;" linkModule="HrApplicantUI" recordId="${applicantId}" src="${MAIN_URL}/api/generic/${companyCode}/profilePic/HrApplicantUI/${applicantId}" requisitionId="${requisitionId}" applicantId="${applicantId}">
                            </div>
                        </div>
                    </div>
                    <div class="box-body text-left box${applicantId}" style="display:none; padding-left: 17px;">
                        <span class="info-box-text">${email} - ${contact}</span>
                        <span class="info-box-text">Applied: <b>${applyDate}</b> - ${applicationStatus}</span>
                        <span class="info-box-text"><i class="fa fa-user"></i> Look For : 
                            <b>
                                <a href="#" class="quickUpdaterTarget" updater="autoComplete" module="HrRequisitionApplicantUI" recordId="${hrRequisitionApplicantId}" fieldName="lookForEmployeeCode">${lookFor}</a>
                            </b>
                        </span>
                        <span class="info-box-text">Resume: ${strUpload} ${strDownload}</span>
                        <span class="info-box-text">${strAccept}</span>
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

    loadFulfilled(obj) {
        var hrRequisitionId = $(obj).val();
        console.log("Arrange Fulfilled Requisition for record ID === "+hrRequisitionId);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadFulfilled/${hrRequisitionId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Arrange Fulfilled Requisition for record ID === "+hrRequisitionId);
            $(".hrRequisitionFulfilled").empty();
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
                var personId = obj.getProp("personId");
    
                var specialization = obj.getProp("specialization");
                if (specialization == undefined) {
                    specialization = "<sub>type specialization here...</sub>";
                }
                var nextScheduleDate = obj.getProp("nextScheduleDate");
                if (nextScheduleDate == undefined) {
                    nextScheduleDate = " Start Date";
                }
                var lookFor = obj.getProp("lookFor");
                if (lookFor == undefined) {
                    lookFor = "<sub>employee here...</sub>";
                }

                var strUpload = `<a href="#" class="btn btn-box-tool quickAttachmentTarget" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Upload Resume"><i class="fa fa-paperclip"> </i> </a>`;
                var strDownload = `<a href="#" class="btn btn-box-tool quickDownloaderTarget" module="HrApplicantUI" recordId="${applicantId}" fileType="RESUME" title="Download Resume"><i class="fa fa-download"> </i> </a>`;
    
                var strHtml = `
                    <div class="col-md-4">
                        <div class="box" draggable="true" ondragstart="hrRequisitionUI.dragApplicant(event)" requisitionId="${requisitionId}" applicantId="${applicantId}">
                            <div class="box-header text-left toggle-box" style="padding-bottom: 0px;" toggleTarget=".box${applicantId}">
                                <div>
                                    <div class="box-title">
                                        <h3 class="box-title">
                                            <a href="#" class="formLinker" recordId="${personId}" linkModule="EmployeeUI">${applicant}</a>
                                        </h3><br/>
                                        <h4 class="box-title">
                                            <a href="#" class="quickUpdaterTarget" updater="text" module="HrApplicantUI" recordId="${applicantId}" fieldName="specialization">${specialization}</a>
                                        </h4><br/>
                                        <a href="#" style="padding-left: 0px;" class="btn btn-box-tool quickUpdaterTarget" updater="calendar" module="HrRequisitionApplicantUI" recordId="${hrRequisitionApplicantId}" fieldName="applyDate"><i class="fa fa-calendar"></i> ${nextScheduleDate}</a>
                                    </div>
                                    <div class="box-tools pull-right">
                                        <img class="img-responsive formLinker img-circle img-bordered-sm profilePic" style="height:57px;" linkModule="HrApplicantUI" recordId="${applicantId}" src="${MAIN_URL}/api/generic/${companyCode}/profilePic/HrApplicantUI/${applicantId}" requisitionId="${requisitionId}" applicantId="${applicantId}">
                                    </div>
                                </div>
                            </div>
                            <div class="box-body text-left box${applicantId}" style="padding-left: 17px;">
                                <span class="info-box-text">${email} - ${contact}</span>
                                <span class="info-box-text">Applied: <b>${applyDate}</b> - ${applicationStatus}</span>
                                <span class="info-box-text"><i class="fa fa-user"></i> Look For : 
                                    <b>
                                        <a href="#" class="quickUpdaterTarget" updater="autoComplete" module="HrRequisitionApplicantUI" recordId="${hrRequisitionApplicantId}" fieldName="lookForEmployeeCode">${lookFor}</a>
                                    </b>
                                </span>
                                <span class="info-box-text">Resume: ${strUpload} ${strDownload}</span>
                            </div>
                        </div>
                    </div>
                `;
                $(".hrRequisitionFulfilled").append(strHtml);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    loadTeamRequisition() {
        console.log("loadTeamRequisition");

        var ajaxRequestDTO = new AjaxRequestDTO();
        ajaxRequestDTO.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadTeamRequisition`;
        ajaxRequestDTO.data = "";

        var successFunction = function(data) {
            console.log(data);
            $(".myTeamRequisition").empty();
            $(data).each(function(index, obj) {
                var requisitionId = obj.getProp("reqId");
                var jobTitle = obj.getProp("title");            
                var recruiter = obj.getProp("recruiter");
                var manager = obj.getProp("manager");
                var status = obj.getProp("status");
                var opening = obj.getProp("opening");

                var strHtml = `
                    <strong><a href="#" class="loadRecordToForm" module="HrRequisitionUI" recordId="${requisitionId}">${jobTitle}</a></strong>
                    <p class="text-muted">
                        Served By: <a>${recruiter}</a> for <a>${manager}</a>
                    </p>
                    <p>
                        <span class="label label-danger">Opening - ${opening}</span>
                        <span class="label label-info">Status - ${status}</span>
                    </p>
                    <hr/>
                `;
                $(".myTeamRequisition").append(strHtml);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadOpenRequisition() {
        console.log("loadOpenRequisition");

        var ajaxRequestDTO = new AjaxRequestDTO();
        ajaxRequestDTO.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadOpenRequisition`;
        ajaxRequestDTO.data = "";

        var successFunction = function(data) {
            console.log(data);
            $(".myOpenRequisition").empty();
            $(data).each(function(index, obj) {
                var requisitionId = obj.getProp("reqId");
                var jobTitle = obj.getProp("title");            
                var recruiter = obj.getProp("recruiter");
                var manager = obj.getProp("manager");
                var status = obj.getProp("status");
                var opening = obj.getProp("opening");

                var strHtml = `
                    <strong><a href="#" class="loadRecordToForm" module="HrRequisitionUI" recordId="${requisitionId}">${jobTitle}</a></strong>
                    <p class="text-muted">
                        Served By: <a>${recruiter}</a> for <a>${manager}</a>
                    </p>
                    <p>
                        <span class="label label-danger">Opening - ${opening}</span>
                        <span class="label label-info">Status - ${status}</span>
                    </p>
                    <hr/>
                `;
                $(".myOpenRequisition").append(strHtml);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadMyAssignedRequisition() {
        console.log("loadMyAssignedRequisition");

        var ajaxRequestDTO = new AjaxRequestDTO();
        ajaxRequestDTO.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/loadMyAssignedRequisition`;
        ajaxRequestDTO.data = "";

        var successFunction = function(data) {
            console.log(data);
            $(".myAssignedRequisition").empty();
            $(data).each(function(index, obj) {
                var requisitionId = obj.getProp("reqId");
                var jobTitle = obj.getProp("title");            
                var recruiter = obj.getProp("recruiter");
                var manager = obj.getProp("manager");
                var status = obj.getProp("status");
                var opening = obj.getProp("opening");

                var strHtml = `
                    <strong><a href="#" class="loadRecordToForm" module="HrRequisitionUI" recordId="${requisitionId}">${jobTitle}</a></strong>
                    <p class="text-muted">
                        Served By: <a>${recruiter}</a> for <a>${manager}</a>
                    </p>
                    <p>
                        <span class="label label-danger">Opening - ${opening}</span>
                        <span class="label label-info">Status - ${status}</span>
                    </p>
                    <hr/>
                `;
                $(".myAssignedRequisition").append(strHtml);
            })
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    loadRecruitmentPerformanceChart() {
        console.log("loadRecruitmentPerformanceChart");

        if ($("#recruitmentPerformanceChart").attr("id")) {
            var recruitmentPerformanceChart = document.getElementById("recruitmentPerformanceChart").getContext("2d");

            var ajaxRequestDTO = new AjaxRequestDTO();
            ajaxRequestDTO.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/recruitmentPerformanceChart`;
            ajaxRequestDTO.data = "";

            var successFunction = function(data) {
                console.log(data);
                widgetChartRule.doChart("#recruitmentPerformanceChart", data, data.chartType, function(evt) {
                    hrRequisitionUI.recruitmentPerformanceChartClickHandler(evt, recruitmentPerformanceChart, this.getElementsAtEvent(evt), this);
                });
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    recruitmentPerformanceChartClickHandler(evt, chart, obj, segment) {
        // var activePoints = chart.getElementsAtEvent(evt);
        // var selectedIndex = activePoints[0]._index;
        // console.log(this.data.datasets[0].data[selectedIndex]);              
        console.log(obj);
        console.log(segment);
    }

    acceptApplicant(obj) {
        var moduleName = $(obj).attr("module");
        var hrRequisitionApplicantId = $(obj).attr("recordId");
        console.log(moduleName);
        console.log(hrRequisitionApplicantId);
        var ajaxRequestDTO = new AjaxRequestDTO();
        ajaxRequestDTO.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/HrRequisitionUI/acceptForEmployment/${hrRequisitionApplicantId}`;
        ajaxRequestDTO.data = "";

        var successFunction = function(data) {
            console.log(data);
            $('.nav-tabs a[href="#Tab4"]').tab('show');
            // var key = data.getProp("key");
            // var value = data.getProp("value");
            // formLinker.linkToForm(key, value)
            loadFulfilled($(mainId));
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

