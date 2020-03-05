class GovernmentReportsUI { 

    loadGovernmentReportsProfile(obj, tabName) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentReportsUI/getGovernmentReportsProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            var GovernmentReportsName = data.getProp("firstName")+" "+data.getProp("lastName");
            var job = data.getProp("specialization");
            var email = data.getProp("email");
            var contact = data.getProp("contact");

            $(".GovernmentReportsUI_GovernmentReportsName").html(GovernmentReportsName);    
            $(".GovernmentReportsUI_GovernmentReports_Job").html(job);    
            $(".GovernmentReportsUI_GovernmentReports_Email").html(email);    
            $(".GovernmentReportsUI_GovernmentReports_Contact").html(contact);   
            $(".GovernmentReportsUI_ProfilePic").attr("src", `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/GovernmentReportsUI/${recordId}`);   
            $(".GovernmentReportsUI_ProfilePic").attr("recordId", recordId);   
            $(".GovernmentReportsUI_ProfilePic").show();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    searchGovernmentReportsFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentReportsUI/filterGovernmentReports/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            GovernmentReportsUI.arrangeSearchedGovernmentReportss(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedGovernmentReportss(data, tabName) {
        console.log(data);
        var divName = `.searchGovernmentReportss[module="GovernmentReportsUI"][tabName="${tabName}"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var GovernmentReportsName = obj.getProp("firstName")+" "+obj.getProp("lastName");
            var email = obj.getPropDefault("email", "");
            var recordId = obj.getProp("GovernmentReportsId");
            var str = `
                <a href="#" class="GovernmentReportsSelect" module="GovernmentReportsUI" tabName="${tabName}" recordId="${recordId}" style="font-weight: bolder;">${GovernmentReportsName}</a>
                <span class="text-muted">
                    ${email}
                </span>
                <hr>
            `;
            $(divName).append(str);
            
        });
    }
}

