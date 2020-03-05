class BusinessPermitUI { 

    loadBusinessPermitProfile(obj, tabName) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BusinessPermitUI/getBusinessPermitProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            var BusinessPermitName = data.getProp("firstName")+" "+data.getProp("lastName");
            var job = data.getProp("specialization");
            var email = data.getProp("email");
            var contact = data.getProp("contact");

            $(".BusinessPermitUI_BusinessPermitName").html(BusinessPermitName);    
            $(".BusinessPermitUI_BusinessPermit_Job").html(job);    
            $(".BusinessPermitUI_BusinessPermit_Email").html(email);    
            $(".BusinessPermitUI_BusinessPermit_Contact").html(contact);   
            $(".BusinessPermitUI_ProfilePic").attr("src", `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/BusinessPermitUI/${recordId}`);   
            $(".BusinessPermitUI_ProfilePic").attr("recordId", recordId);   
            $(".BusinessPermitUI_ProfilePic").show();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    searchBusinessPermitFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/BusinessPermitUI/filterBusinessPermit/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            businessPermitUI.arrangeSearchedBusinessPermits(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedBusinessPermits(data, tabName) {
        console.log(data);
        var divName = `.searchBusinessPermits[module="BusinessPermitUI"][tabName="${tabName}"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var BusinessPermitName = obj.getProp("firstName")+" "+obj.getProp("lastName");
            var email = obj.getPropDefault("email", "");
            var recordId = obj.getProp("BusinessPermitId");
            var str = `
                <a href="#" class="BusinessPermitSelect" module="BusinessPermitUI" tabName="${tabName}" recordId="${recordId}" style="font-weight: bolder;">${BusinessPermitName}</a>
                <span class="text-muted">
                    ${email}
                </span>
                <hr>
            `;
            $(divName).append(str);
            
        });
    }
}

