class GovernmentCashierUI { 

    loadGovernmentCashierProfile(obj, tabName) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentCashierUI/getGovernmentCashierProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            var GovernmentCashierName = data.getProp("firstName")+" "+data.getProp("lastName");
            var job = data.getProp("specialization");
            var email = data.getProp("email");
            var contact = data.getProp("contact");

            $(".GovernmentCashierUI_GovernmentCashierName").html(GovernmentCashierName);    
            $(".GovernmentCashierUI_GovernmentCashier_Job").html(job);    
            $(".GovernmentCashierUI_GovernmentCashier_Email").html(email);    
            $(".GovernmentCashierUI_GovernmentCashier_Contact").html(contact);   
            $(".GovernmentCashierUI_ProfilePic").attr("src", `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/GovernmentCashierUI/${recordId}`);   
            $(".GovernmentCashierUI_ProfilePic").attr("recordId", recordId);   
            $(".GovernmentCashierUI_ProfilePic").show();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    searchGovernmentCashierFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentCashierUI/filterGovernmentCashier/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            GovernmentCashierUI.arrangeSearchedGovernmentCashiers(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedGovernmentCashiers(data, tabName) {
        console.log(data);
        var divName = `.searchGovernmentCashiers[module="GovernmentCashierUI"][tabName="${tabName}"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var GovernmentCashierName = obj.getProp("firstName")+" "+obj.getProp("lastName");
            var email = obj.getPropDefault("email", "");
            var recordId = obj.getProp("GovernmentCashierId");
            var str = `
                <a href="#" class="GovernmentCashierSelect" module="GovernmentCashierUI" tabName="${tabName}" recordId="${recordId}" style="font-weight: bolder;">${GovernmentCashierName}</a>
                <span class="text-muted">
                    ${email}
                </span>
                <hr>
            `;
            $(divName).append(str);
            
        });
    }
}

