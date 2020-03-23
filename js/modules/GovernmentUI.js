class GovernmentUI { 
    changeMainId(obj) {
        utils.loadRecordToForm(obj, governmentUI);
    }

    doMainSearchData(evt) {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/GovernmentUI/quickMainSearcher/${localStorage.filterText}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".quickMainSearcherResult").empty();
            $(data).each(function(index, obj) {
                var recordId = obj.getPropDefault("id", "0");
                var lastName = obj.getPropDefault("lastName", "");
                var firstName = obj.getPropDefault("firstName", "");
                var contact = obj.getPropDefault("contact", "");
                var email = obj.getPropDefault("email", "");

                var str = `
                    <a href="#" class="loadRecordToForm" module="GovernmentUI" recordid="${recordId}" style="font-weight: bold;">${firstName} ${lastName}</a>
                    <p class="text-muted">
                        <i class="fa fa-phone margin-r-5"></i>: ${contact}<br/>
                        <i class="fa fa-envelope margin-r-5"></i>: ${email}
                    </p>
                    <hr>
                `
                $(".quickMainSearcherResult").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    changeModule(evt) {
        governmentUI.init();

        realEstateBuildingPermitUI.loadTopRealEstateBuildingPermits(); 

        personTaskUI.loadTodoList();
        realEstateUI.loadTopRealEstate(); 
        realEstateUI.loadLastSelectedRealEstate(); 

        realEstateTaxUI.loadTopRealEstateTaxes(); 
        realEstateTaxUI.loadLastSelectedRealEstateTax(); 

        communityTaxCertificateUI.loadTopCommunityTaxCertificate(); 
        businessPermitUI.loadTopBusinessPermit(); 
        governmentCashierUI.loadTopCashierQueue();
        governmentPrintingUI.loadTopPrintingQueue()
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }

    selectCedula(obj) {
        console.log("selectSedula");
        console.log("Record ID == "+$(obj).attr("recordId"));
        citizenUI.loadCitizenProfile(obj, "Cedula");
    }

    selectBusinessPermit(obj) {
        console.log("selectBusinessPermit");
        console.log("Record ID == "+$(obj).attr("recordId"));
        citizenUI.loadCitizenProfile(obj, "BusinessPermit");
    }

    selectGovernmentCashier(obj) {
        console.log("selectGovernmentCashier");
        console.log("Record ID == "+$(obj).attr("recordId"));
        citizenUI.loadCitizenProfile(obj, "GovernmentCashier");
    }

}

