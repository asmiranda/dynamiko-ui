var inspectionDate = obj.getPropDefault("inspectionDate", "--");
var realEstateTransferId = obj.getPropDefault("realEstateTransferId", "--");
var inspectorName = obj.getPropDefault("inspectorName", "--");
var amountPaid = obj.getPropDefault("amountPaid", "--");
var personId = obj.getPropDefault("personId", "0");
var contact = obj.getPropDefault("email", "--");
var str = `
    <div style="display: flex; flex-wrap: wrap;">
        <div style="flex: 50%;">
            <span>
                <small class="text-muted"><i class="fa fa-user"> Date: </i>
                    <a href="#" class="RealEstateUI_selectRealEstateTransfer" recordId="${realEstateTransferId}" module="RealEstateUI" tabName="${tabName}">${inspectionDate}</a>
                </small>
            </span>
        </div>
        <div style="flex: 50%">
            <small class="text-muted pull-right"><i class="fa fa-user"> Inspector: </i> ${inspectorName}</small>
        </div>
        <div style="flex: 50%">
            <small class="text-muted"><i class="fa fa-money"> Amount Paid: </i> ${amountPaid}</small>
        </div>
        <div style="flex: 50%">
            <small class="text-muted pull-right"><i class="fa fa-money"> Contact: </i> ${contact}</small>
        </div>
    </div>
    <hr style="margin-top: 5px; width: 98%">
`;
$(divName).append(str);            
