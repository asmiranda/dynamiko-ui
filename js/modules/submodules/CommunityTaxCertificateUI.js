class CommunityTaxCertificateUI { 
    changeCTCValues(obj) {
        var name = $(obj).attr("name");
        if (name=="amountA"||name=="amountB1"||name=="amountB2"||name=="amountB3") {
            var totalAmount = utils.parseFloatOrZero($(`.editCtc[name="amountA"]`).val());
            totalAmount += utils.parseFloatOrZero($(`.editCtc[name="amountB1"]`).val());
            totalAmount += utils.parseFloatOrZero($(`.editCtc[name="amountB2"]`).val());
            totalAmount += utils.parseFloatOrZero($(`.editCtc[name="amountB3"]`).val());
            $(`.editCtc[name="totalAmount"]`).val(totalAmount);
        }
    }

    saveCTCForCashier(obj) {
        console.log("saveCTCForCashier called");
        var tmp = {};
        $(`.editCtc[module="CommunityTaxCertificateUI"]`).each(function (index, myObj) {
            var name = $(myObj).attr("name");
            var value = $(myObj).val();

            tmp[name] = value;
        });
        console.log(tmp);
        var vdata = JSON.stringify(tmp);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/CommunityTaxCertificateUI/post/saveCTCForCashier`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            showModalAny.show("Save CTC Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    newCTC(obj) {
        console.log("newCTC called");
    }

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

            // $(".editCtc[module="CommunityTaxCertificateUI"]_CommunityTaxCertificateName").html(CommunityTaxCertificateName);    
            // $(".editCtc[module="CommunityTaxCertificateUI"]_CommunityTaxCertificate_Job").html(job);    
            // $(".editCtc[module="CommunityTaxCertificateUI"]_CommunityTaxCertificate_Email").html(email);    
            // $(".editCtc[module="CommunityTaxCertificateUI"]_CommunityTaxCertificate_Contact").html(contact);   
            // $(".editCtc[module="CommunityTaxCertificateUI"]_ProfilePic").attr("src", `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/CommunityTaxCertificateUI/${recordId}`);   
            // $(".editCtc[module="CommunityTaxCertificateUI"]_ProfilePic").attr("recordId", recordId);   
            // $(".editCtc[module="CommunityTaxCertificateUI"]_ProfilePic").show();
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

