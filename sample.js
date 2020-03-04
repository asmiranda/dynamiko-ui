loadRealEstateTransfer(recordId) {
    var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateUI/getRealEstateTransfer/${recordId}`;
    var ajaxRequestDTO = new AjaxRequestDTO(url, "");

    var successCallback = function(data) {
        realEstateUI.arrangeSelectedRealEstateTransfer(data, "dashboard");
    };
    ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
}

arrangeSelectedRealEstateTransfer(data, tabName) {
    console.log(data);
    var divName = `.RealEstateUI_TransferRecords[tabName="${tabName}"]`;
    $(divName).empty();
    $(data).each(function(index, obj) {
        var TransferDate = obj.getPropDefault("TransferDate", "--");
        var realEstateTransferId = obj.getPropDefault("realEstateTransferId", "--");
        var assessorName = obj.getPropDefault("assessorName", "--");
        var TransferAmount = obj.getPropDefault("TransferAmount", "--");
        var personId = obj.getPropDefault("personId", "0");
        var contact = obj.getPropDefault("contact", "--");
        var zonalValue = obj.getPropDefault("zonalValue", "--");
        var marketValue = obj.getPropDefault("marketValue", "--");
        var occupied = obj.getProp("occupied");
        var str = `
            <div style="display: flex; flex-wrap: wrap;">
                <div style="flex: 50%;">
                    <span>
                        <small class="text-muted"><i class="fa fa-user"> Date: </i>
                            <a href="#" class="RealEstateUI_selectRealEstateTransfer" recordId="${realEstateTransferId}" module="RealEstateUI" tabName="${tabName}">${TransferDate}</a>
                        </small>
                    </span>
                </div>
                <div style="flex: 50%">
                    <small class="text-muted pull-right"><i class="fa fa-user"> Assessor: </i> ${assessorName}</small>
                </div>
                <div style="flex: 50%">
                    <small class="text-muted"><i class="fa fa-money"> Amount: </i> ${TransferAmount}</small>
                </div>
                <div style="flex: 50%">
                    <small class="text-muted pull-right"><i class="fa fa-compass"> Zonal Value: </i> ${zonalValue}</small>
                </div>
                <div style="flex: 50%">
                    <small class="text-muted"><i class="fa fa-money"> Market Value: </i> ${marketValue}</small>
                </div>
                <div style="flex: 50%">
                    <small class="text-muted pull-right"><i class="fa fa-money"> Contact: </i> ${contact}</small>
                </div>
            </div>
            <hr style="margin-top: 5px; width: 98%">
        `;
        $(divName).append(str);            
    });
}
