class CommunityTaxCertificateUI { 

    loadTopCommunityTaxCertificate() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/CommunityTaxCertificateUI/getTopCommunityTaxCertificates`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            communityTaxCertificateUI.arrangeSearchedCommunityTaxCertificates(data, "CommunityTaxCertificate");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadCommunityTaxCertificateProfile(obj, tabName) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/CommunityTaxCertificateUI/getCommunityTaxCertificateProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            var CommunityTaxCertificateName = data.getProp("firstName")+" "+data.getProp("lastName");
            var job = data.getProp("specialization");
            var email = data.getProp("email");
            var contact = data.getProp("contact");

            $(".CommunityTaxCertificateUI_CommunityTaxCertificateName").html(CommunityTaxCertificateName);    
            $(".CommunityTaxCertificateUI_CommunityTaxCertificate_Job").html(job);    
            $(".CommunityTaxCertificateUI_CommunityTaxCertificate_Email").html(email);    
            $(".CommunityTaxCertificateUI_CommunityTaxCertificate_Contact").html(contact);   
            $(".CommunityTaxCertificateUI_ProfilePic").attr("src", `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/CommunityTaxCertificateUI/${recordId}`);   
            $(".CommunityTaxCertificateUI_ProfilePic").attr("recordId", recordId);   
            $(".CommunityTaxCertificateUI_ProfilePic").show();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    searchCommunityTaxCertificateFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/CommunityTaxCertificateUI/filterCommunityTaxCertificate/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            communityTaxCertificateUI.arrangeSearchedCommunityTaxCertificates(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedCommunityTaxCertificates(data, tabName) {
        console.log(data);
        var divName = `.searchCommunityTaxCertificates[module="CommunityTaxCertificateUI"][tabName="${tabName}"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var CommunityTaxCertificateName = obj.getProp("firstName")+" "+obj.getProp("lastName");
            var email = obj.getPropDefault("email", "");
            var recordId = obj.getProp("CommunityTaxCertificateId");
            var str = `
                <a href="#" class="CommunityTaxCertificateSelect" module="CommunityTaxCertificateUI" tabName="${tabName}" recordId="${recordId}" style="font-weight: bolder;">${CommunityTaxCertificateName}</a>
                <span class="text-muted">
                    ${email}
                </span>
                <hr>
            `;
            $(divName).append(str);
            
        });
    }
}

